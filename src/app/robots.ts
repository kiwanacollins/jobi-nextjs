import { MetadataRoute } from 'next';
import { siteMetadata } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin-setup', '/api']
    },
    host: siteMetadata.siteUrl,
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`
  };
}
