'use server';
import Resume, { IEducation, IExperience } from '@/database/resume.model';
import { connectToDatabase } from '../mongoose';
import cloudinary from 'cloudinary';
// import multer from 'multer';

// const multerUploader = multer({
//   storage: multer.diskStorage({}),
//   limits: { fileSize: 500000 }
// });

interface resumeDataParams {
  userId: string | undefined;
  clerkId: string | null | undefined;
  overview: string;
  education: IEducation[];
  skills: string[];
  experience: IExperience[];
  // file: File;
  pdf: {
    filename: string | null;
    file: string | null;
    url: string | null;
    publicId: string | null;
  };
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function createResume(resumeData: resumeDataParams) {
  try {
    connectToDatabase();
    const { clerkId, education, experience, skills, overview, userId, pdf } =
      resumeData;
    const { file, filename } = pdf;

    const result = await cloudinary.v2.uploader.upload(file as string, {
      folder: 'resumes',
      unique_filename: false,
      use_filename: true
    });
    // console.log(result);

    const newResume = await Resume.create({
      clerkId,
      userId,
      education,
      experience,
      skills,
      overview,
      pdf: {
        filename,
        file: result.secure_url,
        url: result.url,
        publicId: result.public_id
      }
    });
    return newResume;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
