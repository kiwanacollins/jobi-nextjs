'use server';
import Resume, {
  IEducation,
  IExperience,
  IVideos
} from '@/database/resume.model';
import { connectToDatabase } from '../mongoose';
import User from '@/database/user.model';
import { getCandidatesParams } from './shared.types';
import { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';

// import multer from 'multer';

// const multerUploader = multer({
//   storage: multer.diskStorage({}),
//   limits: { fileSize: 500000 }
// });

interface resumeDataParams {
  user: string | undefined;
  overview: string;
  education: IEducation[];
  minSalary: number;
  maxSalary: number;
  skills: string[];
  experience: IExperience[];
  videos: IVideos[];
}

export async function getResumeById(resumeId: string) {
  try {
    await connectToDatabase();
    const resume = await Resume.findById(resumeId)
      .populate({ path: 'user', model: User })
      .exec();
    if (!resume) {
      throw new Error(`User with ID ${resumeId} not found`);
    }

    return JSON.parse(JSON.stringify(resume));
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function createResume(resumeData: resumeDataParams) {
  try {
    await connectToDatabase();
    const {
      education,
      experience,
      skills,
      overview,
      user,
      maxSalary,
      minSalary,
      videos
    } = resumeData;

    const newResume = await Resume.create({
      user,
      education,
      experience,
      videos,
      skills,
      minSalary,
      maxSalary,
      overview
    });

    await User.findOneAndUpdate(
      { _id: user },
      { resumeId: newResume._id },
      {
        new: true
      }
    );

    revalidatePath('/candidates');
    return newResume;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface updateResumeParams {
  resumeId: string;
  resumeData: resumeDataParams;
  path: string;
}

export async function updateResume(params: updateResumeParams) {
  try {
    await connectToDatabase();
    const { resumeId, resumeData, path } = params;
    console.log('updateResume  path:', path);
    const updatedResume = await Resume.findByIdAndUpdate(
      { _id: resumeId },
      resumeData,
      { new: true }
    );

    if (!updatedResume) {
      throw new Error(`User with ID ${resumeId} not found`);
    }

    revalidatePath(path);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getCandidateResumes(params: getCandidatesParams) {
  try {
    connectToDatabase();
    const { keyword } = params;

    const query: FilterQuery<typeof Resume> = {};

    if (keyword) {
      query.$or = [{ 'user.name': { $regex: new RegExp(keyword, 'i') } }];
    }

    const candidates = await Resume.find(query)
      .populate({ path: 'user', model: User })
      .sort({ createdAt: -1 })
      .exec();
    return { status: 'ok', candidates: JSON.parse(JSON.stringify(candidates)) };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

// get All candidates
export async function getAllCandidates() {
  try {
    await connectToDatabase();
    const candidates = await User.find({ role: 'candidate' }).sort({
      createdAt: -1
    });

    return JSON.parse(JSON.stringify(candidates));
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}
