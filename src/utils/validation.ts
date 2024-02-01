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

// const pdfSchema = z.object({
//   file: z.string()
// });

export const resumeSchema = z.object({
  // pdf: pdfSchema,
  overview: z.string(),
  // videos: z.string().array(),
  minSalary: z.number(),
  maxSalary: z.number(),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema)
  // portfolio: z.array(z.string().url('Invalid photo URL'))
});
