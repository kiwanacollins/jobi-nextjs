'use server';
import { revalidatePath } from 'next/cache';
import connectToCloudinary from '../cloudinary';
import { connectToDatabase } from '../mongoose';
import Blog, { IBlog } from '@/database/Blog.model';
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

export async function getBlogById(blogId: string) {
  try {
    await connectToDatabase();

    // Find the blog by ID
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Return the blog details
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    // Handle error (e.g., log, throw, or return a specific error message)
    console.error(`Error fetching blog with ID ${blogId}:`, error);
    throw error;
  }
}

interface IDeleteBlogByIdParams {
  blogId: string;
  path: string;
}

export async function deleteBlogById(params: IDeleteBlogByIdParams) {
  const { blogId, path } = params;
  try {
    await connectToDatabase();
    connectToCloudinary();

    // Find the blog by ID
    const blogToDelete = await Blog.findById(blogId);

    if (!blogToDelete) {
      throw new Error('Blog not found');
    }

    // Delete the image from Cloudinary using the public_id
    if (blogToDelete.image.url && blogToDelete.image.public_id) {
      await cloudinary.v2.uploader.destroy(blogToDelete.image.public_id);
    }

    // Delete the blog from the database
    await Blog.findByIdAndDelete(blogId);

    console.log(`Blog with ID ${blogId} deleted successfully`);
    revalidatePath(path);
    // Optionally, you can return a success message or other relevant information
    return {
      success: true,
      message: `Blog deleted successfully`
    };
  } catch (error) {
    console.error(`Error deleting blog with ID ${blogId}:`, error);
    throw error;
  }
}

interface IUpdateBlogByIdParams {
  blogId: string;
  newData: Partial<IBlog>;
  path: string;
}

export async function updateBlogById(params: IUpdateBlogByIdParams) {
  const { blogId, newData, path } = params;
  try {
    await connectToDatabase(); // Assuming this function connects to your MongoDB database
    connectToCloudinary();

    if (newData.image?.url) {
      const result = await cloudinary.v2.uploader.upload(newData.image.url, {
        folder: 'blogs',
        unique_filename: false,
        use_filename: true
      });
      newData.image.url = result.secure_url;
      newData.image.public_id = result.public_id;
    }

    // Set updatedAt field to the current date and time
    newData.updatedAt = new Date();
    // Find the existing blog by ID
    const blog = await Blog.findOneAndUpdate({ _id: blogId }, newData, {
      new: true
    });
    if (!blog) {
      throw new Error('Blog not found');
    }

    revalidatePath(path);
    // Return the updated blog data
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    // Handle error (e.g., log, throw, or return a specific error message)
    console.error(`Error updating blog with ID ${blogId}:`, error);
    throw error;
  }
}
