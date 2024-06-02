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
  yearStart: z
    .number()
    .nonnegative()
    .refine((val) => val !== undefined && val !== null, {
      message: 'required'
    }),
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
  yearStart: z
    .number()
    .nonnegative()
    .refine((val) => val !== undefined && val !== null, {
      message: 'required'
    }),
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
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal(''))
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
  // minSalary: z.coerce.number().min(1, { message: 'min salary is required' }),
  // maxSalary: z.coerce.number().min(1, { message: 'max salary is required' }),
  // salary_duration: z
  //   .string()
  //   .min(1, { message: 'salary duration is required' })
  //   .optional(),
  experience: z.string().min(1, { message: 'experience is required' }),
  skills: z.array(z.string().optional()).optional(),
  phone: z.string().min(1, { message: 'post is required' }).max(11).optional(),
  picture: z.string().optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  english_fluency: z.string().min(1, { message: 'English fluency is required' })
});

export const employeeProfileSchema = z.object({
  clerkId: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }).max(255),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  email: z.string().max(100).email('Invalid email').readonly(),
  website: z
    .string()
    .min(1, { message: 'Website is required' })
    .url('Invalid URL'),

  bio: z.string().max(500).optional(),
  categories: z
    .array(z.string().min(1, { message: 'categories is required' }))
    .refine((val) => val.length > 0, {
      message: 'Please select at least one categories.'
    }),
  phone: z.string().min(1, { message: 'Phone number is required' }).optional(),
  mediaLinks: linksSchema.optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' })
});

export const formJobDataSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  overview: z.string().min(1, { message: 'Description is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  salary_duration: z.string().min(1, { message: 'salary is required' }),
  category: z.string().min(1, { message: 'category is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'city is required' }),
  skills: z
    .array(z.string().min(1, { message: 'skills is required' }).optional())
    .refine((val) => val.length > 0, {
      message: 'Please select at least one skill.'
    })
    .optional(),
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
  subcategory: z.array(z.string()).optional(),
  image: imageSchema
});

export const courseSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  introVideo: z.string().min(1, { message: 'intro video is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  thumbnail: imageSchema
});

export const moduleVideoSchema = z.object({
  moduleName: z.string().min(1, { message: 'Title is required' }),
  content: z.array(videoSchema)
});

export const moduleNameSchema = z.object({
  moduleName: z.string().min(1, { message: 'Title is required' })
});

export const videoModuleFormSchema = z.object({
  modules: z
    .array(moduleVideoSchema)
    .nonempty('At least one module is required')
});

export const TestimonialSchema = z.object({
  review_text: z.string(),
  review_star: z.number().min(1).max(5),
  desc: z.string(),
  name: z.string(),
  location: z.string(),
  image: z.object({
    url: z
      .string()
      .min(1, {
        message: 'Image is required'
      })
      .url(),
    public_id: z.string().optional()
  })
});
