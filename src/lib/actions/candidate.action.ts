'use server';
import Resume, { IEducation, IExperience } from '@/database/resume.model';
import { connectToDatabase } from '../mongoose';

interface resumeDataParams {
  userId: string | undefined;
  clerkId: string | null | undefined;
  overview: string;
  education: IEducation[];
  skills: string[];
  experience: IExperience[];
}

export async function createResume(resumeData: resumeDataParams) {
  try {
    connectToDatabase();
    const { clerkId, education, experience, skills, overview, userId } =
      resumeData;
    const newResume = await Resume.create({
      clerkId,
      userId,
      education,
      experience,
      skills,
      overview
    });
    return newResume;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
