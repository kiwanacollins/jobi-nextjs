import { MetadataRoute } from 'next';
import { siteMetadata, buildUrl } from '@/lib/seo';
import { connectToDatabase } from '@/lib/mongoose';
import Job from '@/database/job.model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: buildUrl('/jobs'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: buildUrl('/blogs'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: buildUrl('/blog'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6
    },
    {
      url: buildUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: buildUrl('/faq'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4
    }
  ];

  let jobEntries: MetadataRoute.Sitemap = [];

  try {
    await connectToDatabase();
    const jobs = await Job.find({}, { slug: 1, createAt: 1 })
      .sort({ createAt: -1 })
      .lean<{ _id: string; slug?: string; createAt?: Date }[]>();

    jobEntries = jobs.map((job) => ({
      url: job.slug ? buildUrl(`/jobs/${job.slug}`) : buildUrl(`/job/${job._id}`),
      lastModified: job.createAt ? new Date(job.createAt) : now,
      changeFrequency: 'weekly',
      priority: 0.6
    }));
  } catch (error) {
    return staticRoutes;
  }

  return [...staticRoutes, ...jobEntries];
}
