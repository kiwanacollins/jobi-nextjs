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
import connectToCloudinary from '../cloudinary';
import cloudinary from 'cloudinary';

// import multer from 'multer';

// const multerUploader = multer({
//   storage: multer.diskStorage({}),
//   limits: { fileSize: 500000 }
// });

interface IPortfolio {
  imageUrl: string;
  public_id?: string;
}

interface resumeDataParams {
  user: string | undefined;
  overview: string;
  education: IEducation[];
  minSalary: number;
  maxSalary: number;
  skills: string[];
  experience: IExperience[];
  videos?: IVideos[];
  portfolio?: IPortfolio[] | any;
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
    await connectToCloudinary();
    const { education, experience, overview, user, portfolio, videos } =
      resumeData;

    for (const image of portfolio) {
      try {
        const result = await cloudinary.v2.uploader.upload(image?.imageUrl, {
          folder: 'portfolios',
          unique_filename: false,
          use_filename: true
        });

        image.imageUrl = result.secure_url;
        image.public_id = result.public_id;
      } catch (error: any) {
        console.log('error ', error);
        return;
      }
    }

    const newResume = await Resume.create({
      user,
      education,
      experience,
      videos,
      portfolio,
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
    await connectToCloudinary();
    const { resumeId, resumeData, path } = params;
    const { portfolio } = resumeData;

    for (const image of portfolio) {
      try {
        const result = await cloudinary.v2.uploader.upload(image?.imageUrl, {
          folder: 'portfolios',
          unique_filename: false,
          use_filename: true
        });

        image.imageUrl = result.secure_url;
        image.public_id = result.public_id;
      } catch (error: any) {
        console.log('error ', error);
        return;
      }
    }

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
export async function getAllCandidates(params: getCandidatesParams) {
  try {
    await connectToDatabase();

    const {
      keyword,
      query: searchQuery,
      skill,
      qualification,
      gender,
      location,
      experience,
      fluency,
      duration,
      category,
      min,
      max
    } = params;

    const query: FilterQuery<typeof User> = { role: 'candidate' };

    if (searchQuery) {
      query.$or = [];
      query.$or.push(
        { name: { $regex: new RegExp(searchQuery as string, 'i') } },
        { post: { $regex: new RegExp(searchQuery as string, 'i') } },
        {
          qualification: { $regex: new RegExp(searchQuery as string, 'i') }
        },
        {
          post: { $regex: new RegExp(searchQuery as string, 'i') }
        },
        {
          skills: { $elemMatch: { $regex: new RegExp(searchQuery, 'i') } }
        },
        {
          gender: { $eq: searchQuery }
        }
      );
    }

    if (
      keyword ||
      skill ||
      qualification ||
      gender ||
      location ||
      experience ||
      fluency ||
      duration ||
      category ||
      min ||
      max
    ) {
      if (keyword) {
        query.$or = [];
        query.$or.push(
          { name: { $regex: new RegExp(keyword as string, 'i') } },
          { post: { $regex: new RegExp(keyword as string, 'i') } },
          {
            qualification: { $regex: new RegExp(keyword as string, 'i') }
          },
          {
            post: { $regex: new RegExp(keyword as string, 'i') }
          },
          {
            skills: { $elemMatch: { $regex: new RegExp(keyword, 'i') } }
          },
          {
            gender: { $eq: keyword }
          }
        );
      }

      if (qualification) {
        query.qualification = { $regex: new RegExp(qualification, 'i') };
      }
      if (category) {
        query.post = { $regex: new RegExp(category, 'i') };
      }
      if (fluency) {
        query.english_fluency = { $regex: new RegExp(fluency, 'i') };
      }
      if (experience) {
        query.experience = { $regex: new RegExp(experience, 'i') };
      }
      if (skill) {
        query.skills = { $elemMatch: { $regex: new RegExp(skill, 'i') } };
      }
      if (location) {
        query.city = { $regex: new RegExp(location, 'i') };
      }
      if (duration) {
        query.salary_duration = { $regex: new RegExp(duration, 'i') };
      }

      if (gender) {
        query.gender = { $eq: gender };
      }
      if (min !== undefined || max !== undefined) {
        query.$and = [];
        if (min !== undefined) {
          query.$and.push({ minSalary: { $gte: min } });
        }
        if (max !== undefined) {
          query.$and.push({ maxSalary: { $lte: max } });
        }
      }
    }
    console.log('getAllCandidates  query:', query);

    const candidates = await User.find(query).sort({
      joinedAt: -1
    });

    return JSON.parse(JSON.stringify(candidates));
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}
