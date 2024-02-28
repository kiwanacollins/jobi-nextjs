import * as z from 'zod';

const educationSchema = z.object({
  title: z.string().max(100),
  academy: z.string().max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z.string()
});

const experienceSchema = z.object({
  title: z.string().max(100),
  company: z.string().max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z.string()
});

const videoSchema = z.object({
  title: z.string().max(100).optional(),
  videoId: z.string().max(100).optional()
});

export const portfolioSchema = z.object({
  imageUrl: z.string().optional(),
  public_id: z.string().optional()
});

export const resumeSchema = z.object({
  // pdf: pdfSchema,
  overview: z.string(),
  videos: z.array(videoSchema).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema),
  portfolio: z.array(portfolioSchema).optional()
});

const linksSchema = z.object({
  linkedin: z
    .string()
    .min(1, { message: 'linkedin is required' })
    .url('Invalid URL'),
  github: z
    .string()
    .min(1, { message: 'github is required' })
    .url('Invalid URL')
});

// Define the Zod schema for the IUser interface
export const userSchema = z.object({
  clerkId: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }).max(255),
  age: z.number(),
  email: z.string().max(100).email('Invalid email'),
  post: z.string().min(1, { message: 'post is required' }).max(100),
  bio: z.string().min(1, { message: 'post is required' }),
  gender: z.string().optional(),
  qualification: z.string().min(1, { message: 'experience is required' }),
  minSalary: z.number().min(1, { message: 'Minimum salary is required' }),
  maxSalary: z.number().min(1, { message: 'Maximum salary is required' }),
  salary_duration: z.string().optional(),
  experience: z.string().min(1, { message: 'experience is required' }),
  skills: z
    .array(z.string().min(1, { message: 'skills is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one skill.'
    }),
  phone: z.string().min(1, { message: 'post is required' }).max(11).optional(),
  picture: z.string().optional(),
  location: z.string().optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'city is required' }),
  zip: z.string().min(1, { message: 'Zip code is required' })
});

export const employeeProfileSchema = z.object({
  clerkId: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }).max(255),
  email: z.string().max(100).email('Invalid email').readonly(),
  website: z
    .string()
    .min(1, { message: 'Website is required' })
    .url('Invalid URL'),
  established: z
    .string()
    .transform((str) => (str ? new Date(str) : null)) // Convert string to Date or null if string is empty
    .refine(
      (date) => date === null || (!isNaN(date.getTime()) && date <= new Date()),
      {
        message: 'Date must be a valid date and cannot be in the future.'
      }
    )
    .refine((date) => date !== null, {
      message: 'Date is required.'
    }),
  bio: z.string().min(1, { message: 'required' }),
  categories: z
    .array(z.string().min(1, { message: 'categories is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one categories.'
    }),
  companySize: z.number().min(1, { message: 'Field is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }).optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'city is required' }),
  street: z.string().optional(),
  zip: z.string().min(1, { message: 'Zip code is required' }),
  state: z.string().optional()
});

export const formJobDataSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  overview: z.string().min(1, { message: 'Overview is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  salary_duration: z.string().min(1, { message: 'salary is required' }),
  category: z.string().min(1, { message: 'category is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'city is required' }),
  skills: z
    .array(z.string().min(1, { message: 'skills is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one skill.'
    }),
  experience: z.string().min(1, { message: 'Experience salary is required' }),
  minSalary: z.string().min(1, { message: 'Minimum salary is required' }),
  maxSalary: z.string().min(1, { message: 'Maximum salary is required' }),
  industry: z.string().min(1, { message: 'Industry salary is required' }),
  english_fluency: z.string()
});
