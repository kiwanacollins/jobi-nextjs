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
  minSalary: z.number(),
  maxSalary: z.number(),
  education: z.array(educationSchema).optional(),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  portfolio: z.array(portfolioSchema).optional()
});

const linksSchema = z.object({
  linkedin: z.string().max(255).optional(),
  github: z.string().max(255).optional()
});

// Define the Zod schema for the IUser interface
export const userSchema = z.object({
  clerkId: z.string().optional(),
  name: z.string().max(255),
  username: z.string().min(1).max(255),
  age: z.number().optional(),
  email: z.string().max(100).email('Invalid email'),
  post: z.string().max(100),
  bio: z.string().optional(),
  gender: z.string().optional(),
  qualification: z.string().optional(),
  minSalary: z.number(),
  maxSalary: z.number(),
  salary_duration: z.string().optional(),
  experience: z.string().max(150),
  skills: z.array(z.string().max(50)),
  phone: z.string().min(11).max(11).optional(),
  picture: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  zip: z.string().optional(),
  state: z.string().optional(),
  mapLocation: z.string().optional()
});
