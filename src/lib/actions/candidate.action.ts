'use server';
import Resume, { IEducation, IExperience } from '@/database/resume.model';
import { connectToDatabase } from '../mongoose';
import cloudinary from 'cloudinary';
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
  clerkId: string | null | undefined;
  overview: string;
  education: IEducation[];
  minSalary: number;
  maxSalary: number;
  skills: string[];
  experience: IExperience[];
  // file: File;
  pdf: {
    filename: string | null;
    file: string | null;
    url?: string | null;
    publicId?: string | null;
  };
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
      clerkId,
      education,
      experience,
      skills,
      overview,
      user,
      pdf,
      maxSalary,
      minSalary
    } = resumeData;
    const { file, filename } = pdf;

    const result = await cloudinary.v2.uploader.upload(file as string, {
      folder: 'resumes',
      unique_filename: false,
      use_filename: true
    });

    const newResume = await Resume.create({
      clerkId,
      user,
      education,
      experience,
      skills,
      minSalary,
      maxSalary,
      overview,
      pdf: {
        filename,
        file: result.secure_url,
        url: result.url,
        publicId: result.public_id
      }
    });

    await User.findOneAndUpdate(
      { clerkId },
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
