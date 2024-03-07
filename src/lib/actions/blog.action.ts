'use server';
import connectToCloudinary from '../cloudinary';
import { connectToDatabase } from '../mongoose';
import Blog from '@/database/Blog.model';
import cloudinary from 'cloudinary';

export async function createBlog(data: any) {
  try {
    await connectToDatabase();
    connectToCloudinary();
    const { image } = data;
    if (image.url) {
      const result = await cloudinary.v2.uploader.upload(image.url as string, {
        folder: 'blogs',
        unique_filename: false,
        use_filename: true,
        crop: 'scale'
      });

      data.image.url = result.secure_url;
      data.image.public_id = result.public_id;
    }
    const newBlog = await Blog.create(data);
    return JSON.parse(JSON.stringify(newBlog));
  } catch (error) {
    // Handle error (e.g., log, throw, or return a specific error message)
    console.error('Error creating blog:', error);
    throw error;
  }
}

// fetch all blogs
export async function fetchAllBlogs() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    throw error;
  }
}
