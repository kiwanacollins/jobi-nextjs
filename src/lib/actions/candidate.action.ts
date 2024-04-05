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

interface ICreateResumeParams {
  resumeData: resumeDataParams;
  path: string;
}

export async function createResume(params: ICreateResumeParams) {
  const { resumeData, path } = params;
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
        return {
          error: true,
          message: error.message
        };
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

    if (!newResume) {
      return {
        error: true,
        message: 'Error creating resume'
      };
    }

    await User.findOneAndUpdate(
      { _id: user },
      { resumeId: newResume._id },
      {
        new: true
      }
    );

    revalidatePath('/candidates');
    revalidatePath(path);
    return {
      success: true,
      message: 'Resume created successfully',
      data: JSON.parse(JSON.stringify(newResume))
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error.message
    };
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
        return {
          error: true,
          message: 'Error updating portfolio'
        };
      }
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      { _id: resumeId },
      resumeData,
      { new: true }
    );

    if (!updatedResume) {
      return {
        error: true,
        message: 'Error updating resume'
      };
    }

    revalidatePath(path);
    return {
      success: true,
      message: 'Resume updated successfully',
      data: JSON.parse(JSON.stringify(updatedResume))
    };
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return {
      error: true,
      message: error.message
    };
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

// get All Active candidates
export async function getActiveCandidates(params: getCandidatesParams) {
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
      max,
      page = 1,
      pageSize = 8, // default page size is 10,
      sort
    } = params;

    // Calculcate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {
      role: 'candidate',
      resumeId: { $exists: true }
    };

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

    let sortOptions = {};

    switch (sort) {
      case 'old':
        sortOptions = { joinedAt: 1 };
        break;

      case 'name':
        sortOptions = { name: 1 };
        break;

      case 'new':
        sortOptions = { joinedAt: -1 };
        break;

      default:
        sortOptions = { joinedAt: -1 };
        break;
    }

    const candidates = await User.find(query, {
      saved: 0,
      jobPosts: 0,
      joinedAt: 0,
      role: 0,
      mediaLinks: 0
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalCandidates = await User.countDocuments(query);
    const isNext = totalCandidates > skipAmount + candidates.length;

    return { candidates: JSON.parse(JSON.stringify(candidates)), isNext };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

// get All candidates

interface I_GetAllCandidatesProps {
  query?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export async function getAllCandidates(params: I_GetAllCandidatesProps) {
  try {
    await connectToDatabase();

    const {
      query: searchQuery,
      page = 1,
      pageSize = 8, // default page size is 10,
      sort
    } = params;

    // Calculcate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {
      role: 'candidate'
    };

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

    let sortOptions = {};

    switch (sort) {
      case 'old':
        sortOptions = { joinedAt: 1 };
        break;

      case 'name':
        sortOptions = { name: 1 };
        break;

      case 'new':
        sortOptions = { joinedAt: -1 };
        break;

      default:
        sortOptions = { joinedAt: -1 };
        break;
    }

    const candidates = await User.find(query, {
      saved: 0,
      jobPosts: 0,
      joinedAt: 0,
      role: 0,
      mediaLinks: 0
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalCandidates = await User.countDocuments(query);
    const isNext = totalCandidates > skipAmount + candidates.length;

    const totalCandidatesCount = await User.countDocuments({
      role: 'candidate'
    });

    return {
      candidates: JSON.parse(JSON.stringify(candidates)),
      totalCandidates: totalCandidatesCount,
      isNext
    };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}
