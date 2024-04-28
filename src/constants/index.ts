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

export const accountFaq = [
  {
    question: 'How do I create an account?',
    answer:
      'To create an account, click on the "Login/Sign Up" button and provide your basic information such as name, email, and password. Follow the on-screen instructions to complete the registration process.'
  },
  {
    question: 'What should I do if I forget my password?',
    answer:
      "If you forget your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a link to reset your password."
  },
  {
    question: 'How can I update my account information?',
    answer:
      'To update your account information, log in to your account and navigate to your profile or account settings. From there, you can update your personal details, contact information, or other relevant information.'
  },
  {
    question: 'Is my account information secure?',
    answer:
      'Yes, we take data security seriously. Your account information is stored securely, and we use encryption and other security measures to protect your data. We also comply with applicable data protection regulations.'
  },
  {
    question: 'Can I delete my account?',
    answer:
      'Yes, if you wish to delete your account, you can do so by contacting our support team or through your account settings. Please note that this action is irreversible, and all your data will be permanently removed.'
  }
];

export const termsAndConditionsFAQ = [
  {
    question: 'What are the requirements to create an account?',
    answer:
      'You must be at least 18 years old to create an account. When registering, you need to provide accurate information such as your name, email, and a password. By creating an account, you agree to the Terms and Conditions of our platform.'
  },
  {
    question: 'What content is not allowed on the platform?',
    answer:
      'Prohibited content includes discriminatory or offensive material, fraudulent or misleading job listings, harassment, abusive behavior, or unauthorized use of intellectual property. We reserve the right to remove such content and take appropriate action against violators.'
  },
  {
    question: 'How is my account information protected?',
    answer:
      'We take data security seriously. Your account information is protected with encryption, and we comply with data protection regulations. You are responsible for keeping your account secure by not sharing your password with others.'
  },
  {
    question: 'Can my account be terminated or suspended?',
    answer:
      'Yes, we reserve the right to terminate or suspend accounts for violating our Terms and Conditions. If you wish to delete your account, you can do so by contacting our support team. Please note that account deletion is permanent, and all your data will be removed.'
  },
  {
    question: 'How do you handle disputes and complaints?',
    answer:
      'We aim to resolve disputes amicably, but in case of serious issues, disputes are resolved through binding arbitration in [Location], unless otherwise prohibited by law. Users agree to waive their right to class-action lawsuits and jury trials. If you have complaints or issues, please contact our support team for assistance.'
  },
  {
    question: "What are the employer's responsibilities?",
    answer:
      'Employers must provide accurate job descriptions, comply with employment laws, and ensure a safe and non-discriminatory work environment. Posting false or misleading information is prohibited.'
  },
  {
    question: "What are the candidate's responsibilities?",
    answer:
      'Candidates must provide accurate information on their profiles and during the job application process. Falsifying qualifications or experience is not allowed. Candidates should also respect employers and their representatives during interviews and interactions.'
  },
  {
    question: 'How do I report violations or inappropriate content?',
    answer:
      "If you encounter any violations or inappropriate content on the platform, you can report it through the 'Contact Us' page or the reporting feature. Provide detailed information about the issue, and our team will investigate and take appropriate action."
  },
  {
    question: 'How can I update my account information?',
    answer:
      'To update your account information, log in and go to your profile or account settings. From there, you can update your personal details, contact information, and other relevant information.'
  },
  {
    question: 'Can the Terms and Conditions change?',
    answer:
      'Yes, we reserve the right to modify the Terms and Conditions at any time. Any changes will be effective upon posting on our platform. You are responsible for checking for updates, and your continued use of the platform indicates your acceptance of the updated terms.'
  }
];


export const aboutUsContent = [
  {
      question: "Who are we?",
      answer: "We are OneSkill, a dynamic and innovative job posting web application dedicated to connecting employers with talented candidates. With a passion for streamlining the hiring process and fostering meaningful career opportunities, we strive to empower businesses and individuals alike through our user-friendly platform."
  },
  {
      question: "What's our goal?",
      answer: "Our goal at OneSkill is to revolutionize the way job postings are handled, making it easier and more efficient for employers to find the perfect candidates and for job seekers to discover their ideal career opportunities. By harnessing the power of technology and data-driven insights, we aim to create a seamless and transparent recruitment experience that benefits both employers and candidates."
  },
  {
      question: "Our vision",
      answer: "Our vision at OneSkill is to become the go-to platform for job posting and job searching, setting the standard for excellence in the recruitment industry. We envision a future where every employer can effortlessly find the talent they need, and every candidate can easily access the opportunities that align with their skills and aspirations. By continuously innovating and adapting to the evolving needs of the job market, we are committed to realizing this vision and empowering individuals and businesses to thrive."
  }
];
