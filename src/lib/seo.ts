import { IJobData } from '@/database/job.model';

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || 'https://ugandanjobs.example.com';

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

const stripHtml = (value?: string | null) => {
  if (!value) return undefined;
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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
