'use server';

import Testimonial, { ITestimonial } from '@/database/Testimonial';
import { connectToDatabase } from '../mongoose';
import connectToCloudinary from '../cloudinary';
import cloudinary from 'cloudinary';
import { revalidatePath } from 'next/cache';

// create a new testimonial

interface TestimonialParams {
  review_text: string;
  review_star: number;
  desc: string;
  name: string;
  location: string;
  image: {
    url: string;
    public_id?: string;
  };
}
export const createTestimonial = async (data: TestimonialParams) => {
  const { review_text, review_star, desc, name, location, image } = data;
  try {
    connectToDatabase();
    connectToCloudinary();

    if (image?.url) {
      const result = await cloudinary.v2.uploader.upload(image.url as string, {
        folder: 'testimonials',
        unique_filename: false,
        use_filename: true
      });

      image.url = result.secure_url;
      image.public_id = result.public_id;
    }

    const testimonial = await Testimonial.create({
      review_text,
      review_star,
      desc,
      name,
      location,
      image
    });

    if (!testimonial) {
      return {
        error: true,
        message: 'Testimonial not created'
      };
    }
    await testimonial.save();
    return {
      success: true,
      message: 'Testimonial created successfully'
    };
  } catch (error: any) {
    console.error('Error creating testimonial', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// get all testimonials
export const getTestimonials = async () => {
  try {
    connectToDatabase();
    const testimonials = await Testimonial.find();
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error: any) {
    console.error('Error getting testimonials', error);
  }
};

// get single testimonial by id

interface GetTestimonialParams {
  id: string;
}

export const getSingleTestimonial = async (params: GetTestimonialParams) => {
  const { id } = params;
  try {
    connectToDatabase();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return {
        error: true,
        message: 'Testimonial not found'
      };
    }
    return JSON.parse(JSON.stringify(testimonial));
  } catch (error: any) {
    console.error('Error getting testimonial', error);
    return {
      error: true,
      message: error.message
    };
  }
};

// delete single testimonial by id

interface DeleteTestimonialParams {
  id: string;
  path: string;
}

export const deleteTestimonial = async (params: DeleteTestimonialParams) => {
  const { id, path } = params;
  try {
    connectToDatabase();
    connectToCloudinary();
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return {
        error: true,
        message: 'Testimonial not found'
      };
    }
    // delete image from cloudinary
    if (testimonial.image?.public_id) {
      await cloudinary.v2.uploader.destroy(testimonial.image.public_id);
    }
    revalidatePath(path);
    return {
      success: true,
      message: 'Testimonial deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting testimonial', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// update single testimonial by id

interface UpdateTestimonialParams {
  reviewId: string;
  updataData: Partial<ITestimonial>;
  path: string;
}

export const updateTestimonial = async (params: UpdateTestimonialParams) => {
  const { reviewId, updataData, path } = params;
  try {
    connectToDatabase();
    connectToCloudinary();
    // get the testimonial by id
    const testimonial = await Testimonial.findById(reviewId);
    // update cloudinary image
    if (testimonial?.image?.url !== updataData.image?.url) {
      const result = await cloudinary.v2.uploader.upload(
        updataData?.image?.url as string,
        {
          folder: 'testimonials',
          unique_filename: false,
          use_filename: true
        }
      );
      // @ts-ignore
      updataData.image.url = result.secure_url;
      // @ts-ignore
      updataData.image.public_id = result.public_id;
      // delete image from cloudinary
      if (testimonial?.image?.public_id) {
        await cloudinary.v2.uploader.destroy(testimonial.image.public_id);
      }
    } else {
      updataData.image = testimonial?.image;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      reviewId,
      updataData,
      { new: true }
    );
    if (!updatedTestimonial) {
      return {
        error: true,
        message: 'Testimonial not found'
      };
    }
    revalidatePath(path);
    return {
      success: true,
      message: 'Testimonial updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating testimonial', error);
    return {
      success: false,
      message: error.message
    };
  }
};
