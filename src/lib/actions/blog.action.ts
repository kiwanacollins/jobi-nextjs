'use server';
import { revalidatePath } from 'next/cache';
import connectToCloudinary from '../cloudinary';
import { connectToDatabase } from '../mongoose';
import Blog, { IBlog } from '@/database/Blog.model';
import cloudinary from 'cloudinary';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing spaces
    .substring(0, 60); // Limit length
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string, blogId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = blogId ? { slug, _id: { $ne: blogId } } : { slug };
    const existingBlog = await Blog.findOne(query);
    
    if (!existingBlog) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createBlog(data: any) {
  try {
    await connectToDatabase();
    connectToCloudinary();
    
    // Generate slug from title
    const baseSlug = generateSlug(data.title);
    data.slug = await ensureUniqueSlug(baseSlug);
    
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
    if (!newBlog) {
      return {
        error: false,
        message: 'Failed to create blog'
      };
    }
    return {
      success: true,
      message: 'Blog created successfully'
    };
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

export async function getBlogBySlug(slug: string) {
  try {
    await connectToDatabase();

    // Find the blog by slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Return the blog details
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    // Handle error (e.g., log, throw, or return a specific error message)
    console.error(`Error fetching blog with slug ${slug}:`, error);
    throw error;
  }
}

// Get blog by slug or ID (flexible function)
export async function getBlogBySlugOrId(identifier: string) {
  try {
    await connectToDatabase();
    
    if (!identifier) {
      throw new Error('Invalid blog identifier');
    }
    
    let blog;
    const mongoose = require('mongoose');
    
    // Check if identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      // Try to find by ID first
      blog = await Blog.findById(identifier);
    }
    
    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!blog) {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      throw new Error('Blog not found');
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error(`Error fetching blog with identifier ${identifier}:`, error);
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
    const blog = await Blog.findById(blogId);

    // Update slug if title is being changed
    if (newData.title && newData.title !== blog?.title) {
      const baseSlug = generateSlug(newData.title);
      newData.slug = await ensureUniqueSlug(baseSlug, blogId);
    }

    if (newData.image?.url && newData.image?.url !== blog?.image?.url) {
      const result = await cloudinary.v2.uploader.upload(newData.image.url, {
        folder: 'blogs',
        unique_filename: false,
        use_filename: true
      });
      newData.image.url = result.secure_url;
      newData.image.public_id = result.public_id;

      // delete old image from cloudinary
      if (blog?.image.url && blog?.image.public_id) {
        await cloudinary.v2.uploader.destroy(blog.image.public_id);
      }
    } else {
      //@ts-ignore
      newData.image.url = blog?.image.url;
      //@ts-ignore
      newData.image.public_id = blog?.image.public_id;
    }

    // Set updatedAt field to the current date and time
    newData.updatedAt = new Date();
    // Find the existing blog by ID
    const updatedBlog = await Blog.findOneAndUpdate({ _id: blogId }, newData, {
      new: true
    });
    if (!updatedBlog) {
      return {
        error: true,
        message: 'Failed to update blog'
      };
    }

    revalidatePath(path);
    // Return the updated blog data
    return {
      success: true,
      message: 'Blog updated successfully'
    };
  } catch (error) {
    // Handle error (e.g., log, throw, or return a specific error message)
    console.error(`Error updating blog with ID ${blogId}:`, error);
    throw error;
  }
}
