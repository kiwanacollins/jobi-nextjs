import * as z from 'zod';

const educationSchema = z.object({
  title: z.string().max(100),
  academy: z.string().max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z.string().max(500)
});

const experienceSchema = z.object({
  title: z.string().max(100),
  company: z.string().max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z.string().max(50)
});

export const resumeSchema = z.object({
  // filename: z.string().min(1, 'Filename is required'),
  overview: z.string(),
  // videos: z.string().array(),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema)
  // portfolio: z.array(z.string().url('Invalid photo URL'))
});
