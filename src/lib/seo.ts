import { IJobData } from '@/database/job.model';

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || 'https://ugandanjobs.net';

export const siteMetadata = {
  title: 'Ugandan Jobs | Find Verified Opportunities in Uganda and Abroad',
  siteName: 'Ugandan Jobs',
  description:
    'Discover curated job opportunities for Ugandan professionals. Search verified openings across Uganda and international employers hiring Ugandan talent.',
  keywords: [
    'Uganda jobs',
    'jobs in Uganda',
    'Ugandan job portal',
    'job adverts',
    'job notices',
    'job openings Uganda',
    'Uganda employment',
    'Kampala jobs',
    'remote jobs for Ugandans',
    'international jobs for Ugandans',
    'Uganda careers',
    'job listings Uganda',
    'Ugandan professionals'
  ],
  locale: 'en_UG',
  siteUrl: DEFAULT_SITE_URL,
  twitterHandle: '@ugandanjobs',
  contactEmail: 'support@ugandanjobs.com'
};

export const buildUrl = (path = '/') => {
  try {
    const normalisedPath = path.startsWith('/') ? path : `/${path}`;
    return new URL(normalisedPath, siteMetadata.siteUrl).toString();
  } catch (error) {
    return `${siteMetadata.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
};

// Ensure image URL is absolute for social sharing
export const normalizeImageUrl = (imageUrl?: string | null, fallback = '/logo.png'): string => {
  if (!imageUrl) return buildUrl(fallback);
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a data URL (base64), return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // If relative path, make it absolute
  return buildUrl(imageUrl);
};

// Ensure image fits social media preview requirements (1200x630 recommended)
// If Cloudinary URL, apply a transformation to fill with white background
export const ensureSocialImageSize = (url: string): string => {
  try {
    const absolute = normalizeImageUrl(url);
    const isCloudinary = /res\.cloudinary\.com\//.test(absolute);
    if (!isCloudinary) return absolute;

    // Inject transformation segment after '/upload/' if not already present
    // e.g., https://res.cloudinary.com/<cloud>/image/upload/<transform>/path.png
    return absolute.replace(
      /(\/upload\/)(?!.*w_\d+)/,
      '$1w_1200,h_630,c_fill,b_white,f_auto,q_auto/'
    );
  } catch {
    return normalizeImageUrl(url);
  }
};

const stripHtml = (value?: string | null) => {
  if (!value) return undefined;
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

// Build rich metadata for job sharing on social platforms (WhatsApp, Facebook, Twitter, etc.)
export const buildJobShareMetadata = (job: Partial<IJobData>) => {
  if (!job) return null;

  const title = job.company && job.title 
    ? `${job.title} at ${job.company}` 
    : job.title || 'Job Opening';
  
  const overview = stripHtml(job.overview) || '';
  const locationText = job.location ? `📍 ${job.location}` : '';
  const durationText = job.duration ? `⏰ ${job.duration}` : '';
  const categoryText = job.category ? `💼 ${job.category}` : '';
  
  const details = [locationText, durationText, categoryText].filter(Boolean).join(' • ');
  const descriptionPreview = overview.slice(0, 120);
  
  const description = details 
    ? `${details}\n\n${descriptionPreview}${overview.length > 120 ? '...' : ''}`
    : descriptionPreview;

  const imageUrl = ensureSocialImageSize(normalizeImageUrl(job.companyImage));

  return {
    title,
    description: description || 'Find the latest job vacancies in Uganda across various industries.',
    imageUrl,
    alt: `${job.company || 'Company'} logo - Job opportunity in Uganda`
  };
};

const normaliseCurrency = (country?: string) => {
  if (!country) return 'UGX';
  const lowered = country.toLowerCase();
  if (lowered.includes('uganda')) return 'UGX';
  if (lowered.includes('kenya')) return 'KES';
  if (lowered.includes('tanzania')) return 'TZS';
  if (lowered.includes('rwanda')) return 'RWF';
  if (lowered.includes('burundi')) return 'BIF';
  if (lowered.includes('south sudan')) return 'SSP';
  return 'USD';
};

export const buildJobPostingJsonLd = (job: Partial<IJobData>) => {
  if (!job) return undefined;

  const description = stripHtml(job.overview) || undefined;
  const currency = normaliseCurrency(job.country || job.location);
  const hasSalary = typeof job.minSalary === 'number' || typeof job.maxSalary === 'number';
  const baseSalary = hasSalary
    ? {
        '@type': 'MonetaryAmount',
        currency,
        value: {
          '@type': 'QuantitativeValue',
          ...(typeof job.minSalary === 'number' ? { minValue: job.minSalary } : {}),
          ...(typeof job.maxSalary === 'number' ? { maxValue: job.maxSalary } : {}),
          unitText: job.salary_duration?.toUpperCase() || 'MONTH'
        }
      }
    : undefined;

  const jobLocationType = job.location?.toLowerCase().includes('remote')
    ? 'TELECOMMUTE'
    : undefined;

  const jobLocation = jobLocationType
    ? undefined
    : job.location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: job.country || 'UG',
            addressLocality: job.city || job.location,
            ...(job.address ? { streetAddress: job.address } : {})
          }
        }
      : undefined;

  const validThrough = job.deadline instanceof Date
    ? job.deadline.toISOString()
    : (typeof job.deadline === 'string' ? job.deadline : undefined);

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description,
      datePosted: job.createAt instanceof Date ? job.createAt.toISOString() : job.createAt,
      validThrough,
      employmentType: job.duration,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.company,
        sameAs: siteMetadata.siteUrl,
        ...(job.companyImage
          ? {
              logo: job.companyImage.startsWith('http')
                ? job.companyImage
                : buildUrl(job.companyImage)
            }
          : {})
      },
      jobLocation,
      jobLocationType,
      applicantLocationRequirements: job.country
        ? {
            '@type': 'Country',
            name: job.country
          }
        : undefined,
      industry: job.industry,
      baseSalary,
      directApply: true,
  url: job.slug ? buildUrl(`/jobs/${job.slug}`) : undefined
    },
    (_key, value) => (value === undefined ? undefined : value)
  );
};
