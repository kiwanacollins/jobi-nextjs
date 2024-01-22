import * as Yup from 'yup';

export const jobValidationSchema = Yup.object({
  id: Yup.number().required('ID is required'),
  logo: Yup.mixed().required('Logo is required'), // Assuming validation for StaticImageData exists
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters'),
  duration: Yup.string().required('Duration is required'),
  date: Yup.string().required('Date is required'),
  company: Yup.string().required('Company is required'),
  location: Yup.string().required('Location is required'),
  category: Yup.array()
    .of(Yup.string().required('Category is required'))
    .required('Category is required'),
  tags: Yup.array().of(Yup.string()), // Optional field
  experience: Yup.string().required('Experience is required'),
  salary: Yup.number()
    .required('Salary is required')
    .positive('Salary must be positive'),
  salary_duration: Yup.string().required('Salary duration is required'),
  english_fluency: Yup.string().required('English fluency is required'),
  overview: Yup.string()
    .required('Overview is required')
    .min(50, 'Overview must be at least 50 characters')
  // Not exposed to user input, but validated for consistency
});

export const userSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  bio: Yup.string(),
  picture: Yup.string(),
  location: Yup.string(),
  portfolioWebsite: Yup.string().url('Invalid URL'),
  // address: Yup.object({
  //   address: Yup.string().required('Address is required'),
  //   country: Yup.string().required('Country is required'),
  //   city: Yup.string().required('City is required'),
  //   street: Yup.string().required('Street is required'),
  //   zip: Yup.string().required('Zip code is required'),
  //   state: Yup.string().required('State is required'),
  //   mapLocation: Yup.string()
  // }),
  address: Yup.string().required('Address is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  street: Yup.string().required('Street is required'),
  zip: Yup.string().required('Zip code is required'),
  state: Yup.string().required('State is required'),
  mapLocation: Yup.string(),

  mediaLinks: Yup.object({
    linkedin: Yup.string(),
    github: Yup.string()
  })
});
