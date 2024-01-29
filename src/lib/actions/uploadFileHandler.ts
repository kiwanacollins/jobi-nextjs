'use server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFileHandler = async (filePath: any) => {
  console.log('uploadFileHandler  filePath:', filePath);
  try {
    const result = await cloudinary.v2.uploader.upload(filePath);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
