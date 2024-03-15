import * as z from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Invalid email address' })
});

const educationSchema = z.object({
  title: z.string().min(1, { message: 'title is required' }).max(100),
  academy: z.string().min(1, { message: 'academy is required' }).max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z
    .string()
    .min(1, { message: 'description is required' })
    .max(500)
});

const experienceSchema = z.object({
  title: z.string().min(1, { message: 'title is required' }).max(100),
  company: z.string().min(1, { message: 'company is required' }).max(100),
  yearStart: z.number(),
  yearEnd: z.number().optional(),
  year: z.string().optional(),
  description: z
    .string()
    .min(1, { message: 'description is required' })
    .max(500)
});

const videoSchema = z.object({
  title: z.string().min(1, { message: 'title is required' }).max(100),
  videoId: z.string().min(1, { message: 'video id is required' }).max(100)
});

export const portfolioSchema = z.object({
  imageUrl: z.string().optional(),
  public_id: z.string().optional()
});

export const resumeSchema = z.object({
  overview: z.string().min(1, { message: 'overview is required' }).max(500),
  videos: z.array(videoSchema),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  portfolio: z.array(portfolioSchema)
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
  age: z.coerce.number().min(1, { message: 'Age is required' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .max(100)
    .email('Invalid email'),
  post: z.string().min(1, { message: 'post is required' }).max(100),
  bio: z.string().min(1, { message: 'post is required' }),
  gender: z.string().optional(),
  qualification: z.string().min(1, { message: 'experience is required' }),
  minSalary: z.coerce.number().min(1, { message: 'min salary is required' }),
  maxSalary: z.coerce.number().min(1, { message: 'max salary is required' }),
  salary_duration: z
    .string()
    .min(1, { message: 'salary duration is required' }),
  experience: z.string().min(1, { message: 'experience is required' }),
  skills: z
    .array(z.string().min(1, { message: 'skills is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one skill.'
    }),
  phone: z.string().min(1, { message: 'post is required' }).max(11).optional(),
  picture: z.string().optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'city is required' }),
  zip: z.string().min(1, { message: 'Zip code is required' }),
  english_fluency: z.string().min(1, { message: 'English fluency is required' })
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
  minSalary: z.number(),
  maxSalary: z.number().min(1, { message: 'Maximum salary is required' }),
  industry: z.string().min(1, { message: 'Industry salary is required' }),
  english_fluency: z.string().min(1, { message: 'English fluency is required' })
});

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email in required' })
    .email({ message: 'Invalid email address' }),
  subject: z.string().optional(),
  message: z.string().min(1, { message: 'Message is required' })
});

const imageSchema = z.object({
  url: z.string().min(1, { message: 'Image is required' }),
  public_id: z.string().optional()
});
export const blogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  image: imageSchema,
  author: z.string().optional(),
  tags: z
    .array(z.string().min(1, { message: 'tags is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one tag.'
    })
});

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category is required' }),
  subcategory: z.array(z.string()).optional()
});
