import * as z from 'zod';

const educationSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  academy: z.string().min(2, 'Academy is required'),
  startingYear: z.number().min(2, 'Starting year is required'),
  endingYear: z.string().optional(),
  year: z.string().optional(),
  description: z.string()
});

const skillsSchema = z.object({
  skills: z.string().array().nonempty('Skills list cannot be empty')
});

const experienceSchema = z.object({
  title: z.string().min(4, 'Title is required'),
  company: z.string().min(3, 'Company is required'),
  startingYear: z.number().min(2, 'Starting year is required'),
  endingYear: z.string().optional(),
  year: z.string().optional(),
  description: z.string()
});

export const resumeSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  overview: z.string(),
  videos: z.string().array(),
  education: z.array(educationSchema),
  skills: z.array(skillsSchema),
  experience: z.array(experienceSchema),
  portfolio: z.array(z.string().url('Invalid photo URL'))
});
