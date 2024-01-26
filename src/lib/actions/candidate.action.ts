'use server';
import { connectToDatabase } from '../mongoose';

export async function createResume(resumeData: any) {
  try {
    connectToDatabase();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
