export const skills = [
  'Design',
  'UI',
  'React',
  'Nextjs',
  'Digital',
  'Graphics',
  'Developer',
  'Product',
  'Microsoft',
  'Brand',
  'Photoshop',
  'Business',
  'IT & Technology',
  'Marketing',
  'Article',
  'Engineer',
  'HTML5',
  'Figma',
  'Automobile',
  'Account'
];

// slider setting
export const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: '0px',
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

export const qualificationOptions = [
  { value: `master's degree`, label: `Master's Degree` },
  { value: `Bachelor degree`, label: `Bachelor Degree` },
  { value: `Higher Secondary`, label: `Higher Secondary` },
  { value: `Secondary School`, label: `Secondary School` }
];

export const experienceOptions = [
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'No-Experience', label: 'No-Experience' },
  { value: 'Expert', label: 'Expert' }
];

export const englishLevelOptions = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Conversational', label: 'Conversational' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Native', label: 'Native' }
];
export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export const getLast30YearsOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let i = currentYear; i >= currentYear - 29; i--) {
    options.push(i);
  }

  return options;
};
