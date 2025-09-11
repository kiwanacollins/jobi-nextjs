import qs from 'query-string';

export const animationCreate = () => {
  if (typeof window !== 'undefined') {
    import('wowjs').then((module) => {
      const WOW = module.default;
      new WOW.WOW({ live: false }).init();
    });
  }
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname || '',
      query: currentUrl
    },
    { skipNull: true }
  );
};

interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove
}: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname || '',
      query: currentUrl
    },
    { skipNull: true }
  );
};

export const getTimestamp = (createdAt: Date): string => {
  const currentTime: Date = new Date();
  const postTime: Date = new Date(createdAt);
  const timeDifference: number = currentTime.getTime() - postTime.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const weeks: number = Math.floor(days / 7);
  const months: number = Math.floor(days / 30);
  const years: number = Math.floor(days / 365);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

export const getTime = (dateString: Date): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

// Generate SEO-friendly slug from company and job title
export const generateJobSlug = (title: string, company?: string): string => {
  // Clean and prepare company name
  const cleanCompany = company 
    ? company.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 20) // Limit company length
    : '';
    
  // Clean and prepare job title
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40); // Limit title length
    
  // Combine company + title for SEO-friendly URL
  const slug = cleanCompany 
    ? `${cleanCompany}-${cleanTitle}`
    : cleanTitle;
    
  return slug.substring(0, 60); // Overall length limit
};

// Generate unique slug by adding incremental number if needed
export const generateUniqueJobSlug = async (title: string, company?: string): Promise<string> => {
  const baseSlug = generateJobSlug(title, company);
  
  // We'll need to import Job model to check for existing slugs
  // For now, return base slug - we'll handle uniqueness in the job action
  return baseSlug;
};
