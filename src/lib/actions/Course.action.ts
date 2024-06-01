'use server';

import Course, { ICourse } from '@/database/Course.model';
import { connectToDatabase } from '../mongoose';
import connectToCloudinary from '../cloudinary';
import cloudinary from 'cloudinary';
import { revalidatePath } from 'next/cache';
import Module, { IModule } from '@/database/Module.model';
import User from '@/database/user.model';
import Progress from '@/database/Progress.model';
import console from 'console';

interface createCourseParams {
  title: string;
  introVideo?: string;
  description: string;
  creator: string;
  thumbnail: {
    url: string;
    public_id?: string;
  };
}

export const createNewCourse = async (params: createCourseParams) => {
  const { title, introVideo, description, creator, thumbnail } = params;

  try {
    await connectToDatabase();
    connectToCloudinary();

    if (thumbnail.url) {
      const result = await cloudinary.v2.uploader.upload(
        thumbnail.url as string,
        {
          folder: 'courses',
          width: 350
        }
      );

      if (!result) {
        return { error: true, message: 'Error uploading thumbnail' };
      }
      thumbnail.url = result.secure_url;
      thumbnail.public_id = result.public_id;
    }

    const newCourse = await Course.create({
      title,
      introVideo,
      description,
      creator,
      thumbnail
    });

    if (!newCourse) {
      return {
        error: true,
        message: 'Course not created'
      };
    }

    return {
      success: true,
      message: 'Course created successfully'
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    await connectToDatabase();
    const courses = await Course.find({});

    if (!courses) {
      return { error: true, message: 'No courses found' };
    }

    return { success: true, courses: JSON.parse(JSON.stringify(courses)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSingleCourseById = async (courseId: string) => {
  try {
    await connectToDatabase();
    const course = await Course.findById(courseId).populate([
      { path: 'modules', model: Module }
    ]);

    if (!course) {
      return { error: true, message: 'Course not found' };
    }

    return { success: true, course: JSON.parse(JSON.stringify(course)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface IUpdateCourseProps {
  courseId: string;
  updateData: Partial<ICourse>;
  path: string;
}

export const updateCourse = async (params: IUpdateCourseProps) => {
  const { courseId, updateData, path } = params;
  try {
    connectToDatabase();
    connectToCloudinary();

    const course = await Course.findById(courseId);

    if (
      updateData.thumbnail?.url &&
      updateData.thumbnail?.url !== course?.thumbnail.url
    ) {
      const result = await cloudinary.v2.uploader.upload(
        updateData.thumbnail?.url as string,
        {
          folder: 'courses',
          unique_filename: false,
          use_filename: true
        }
      );

      updateData.thumbnail.url = result.secure_url;
      updateData.thumbnail.public_id = result.secure_url;
      // delete the old thumbnail
      if (course?.thumbnail.public_id) {
        await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
      }
    } else {
      //@ts-ignore
      updateData.thumbnail.url = course?.thumbnail.url;
      //@ts-ignore
      updateData.thumbnail.public_id = course?.thumbnail.public_id;
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId },
      updateData,
      {
        new: true
      }
    );
    if (!updatedCourse) {
      return {
        error: true,
        message: 'Course not found'
      };
    }

    revalidatePath(path);
    return {
      success: true,
      message: 'Course updated successfully'
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// delete course

interface deleteCourseByIdParams {
  courseId: string;
  path: string;
}

export const deleteCourseById = async (params: deleteCourseByIdParams) => {
  const { courseId, path } = params;
  try {
    await connectToDatabase();
    connectToCloudinary();
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return { error: true, message: 'Course not found' };
    }
    // delete the course thumbnail
    if (course.thumbnail.public_id) {
      await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
    }
    // also delete the modules from module collection
    await Module.deleteMany({ course: course._id });
    revalidatePath(path);
    return { success: true, message: 'Course deleted successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// add module to courses collection

interface IAddModuleToCourseParams {
  courseId: string;
  moduleName: string;
  path: string;
}

export const addModuleToCourse = async (params: IAddModuleToCourseParams) => {
  const { courseId, moduleName, path } = params;
  try {
    await connectToDatabase();
    const module = await Module.create({
      title: moduleName,
      course: courseId
    });

    if (!module) {
      return { error: true, message: 'Course not found' };
    }
    // find the course
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { modules: module._id } },
      { new: true }
    );

    await updatedCourse.save();
    revalidatePath(path);
    return { success: true, message: 'Module added successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface IUpdateModuleParams {
  moduleId: string;
  updateData: Partial<IModule>;
  path: string;
}

export const updateModule = async (params: IUpdateModuleParams) => {
  const { moduleId, updateData, path } = params;
  try {
    connectToDatabase();

    const updatedCourse = await Module.findOneAndUpdate(
      { _id: moduleId },
      updateData,
      {
        new: true
      }
    );
    if (!updatedCourse) {
      return {
        error: true,
        message: 'Course not found'
      };
    }

    revalidatePath(path);
    return {
      success: true,
      message: 'Course updated successfully'
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get single module by id

export const getModuleById = async (moduleId: string) => {
  try {
    await connectToDatabase();
    const module = await Module.findById(moduleId);
    if (!module) {
      return { error: true, message: 'Module not found' };
    }

    return { success: true, module: JSON.parse(JSON.stringify(module)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface IDeleteModuleParams {
  moduleId: string;
  path: string;
}
export const deleteModuleById = async (params: IDeleteModuleParams) => {
  const { moduleId, path } = params;
  try {
    await connectToDatabase();
    const module = await Module.findByIdAndDelete(moduleId);

    if (!module) {
      return { error: true, message: 'Module not found' };
    }
    revalidatePath(path);
    return { success: true, message: 'Module deleted successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get module by course id

export const getModulesByCourseId = async (courseId: string) => {
  try {
    await connectToDatabase();
    const modules = await Module.find({ course: courseId });

    if (!modules) {
      return { error: true, message: 'No modules found' };
    }

    return { success: true, modules: JSON.parse(JSON.stringify(modules)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// enroll to course by course id and userId

interface IEnrollToCourseParams {
  courseId: string;
  userId: string;
  path: string;
}

export const enrollToCourse = async (params: IEnrollToCourseParams) => {
  const { courseId, userId, path } = params;
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { enrolledUsers: user._id }
      },
      { new: true }
    );

    if (!course) {
      return { error: true, message: 'Course not found' };
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { course: course._id }
      },
      { new: true }
    );

    // create user progress for each module
    await Progress.create({
      user: user._id,
      clerkId: userId,
      course: course._id
    });
    revalidatePath(path);
    return { success: true, message: 'Enrolled successfully' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// update course progress bar

interface IUpdateCourseProgressParams {
  userId: string;
  courseId: string;
  videoId: string;
  path: string;
}

export const updateCourseProgress = async (
  params: IUpdateCourseProgressParams
) => {
  const { userId, courseId, videoId, path } = params;
  try {
    connectToDatabase();
    const filter = { clerkId: userId, course: courseId };
    const progress = await Progress.findOne(filter);
    if (!progress) {
      return {
        error: true,
        message: 'Could not find user Progress'
      };
    }

    const course = await Course.findById(progress.course).populate('modules');
    const totalCourseVideos = course?.modules.reduce(
      (accumulator: number, module: IModule) => {
        // Add the count of videos in each module to the accumulator
        return accumulator + module.content.length;
      },
      0
    );

    if (!progress.completedVideos.includes(videoId)) {
      progress.completedVideos.push(videoId);
    }

    const numOfVideoWatched = progress.completedVideos.length;

    const progressPercentage = Math.round(
      (numOfVideoWatched / totalCourseVideos) * 100
    );

    const update = {
      completedVideos: progress.completedVideos,
      progress: progressPercentage,
      lastUpdated: new Date()
    };

    const options = { upsert: true, new: true };
    const result = await Progress.findOneAndUpdate(filter, update, options);

    if (!result) {
      return {
        error: true,
        message: 'Could not find user Progress'
      };
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    return { error: 'Error updating progress' };
  }
};

// get progress states using the current user

interface IGetUserProgressStatesParams {
  userId: string;
}

export const getUserProgressStates = async (
  params: IGetUserProgressStatesParams
) => {
  const { userId } = params;
  try {
    await connectToDatabase();
    const progress = await Progress.findOne({ clerkId: userId });

    if (!progress) {
      return {
        error: true,
        message: 'Could not find user Progress'
      };
    }

    // console.log(progress);
    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.log(error);
  }
};
