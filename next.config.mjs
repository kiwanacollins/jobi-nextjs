import createMDX from '@next/mdx';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  experimental: {
    mdxRs: true,
    serverComponentsExternalPackages: ['mongoose'],
    serverActions: {
      bodySizeLimit: '3mb'
    },
    // Skip generating static pages for faster builds
    isrMemoryCacheSize: 0
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      },
      {
        protocol: 'http',
        hostname: '*'
      }
    ]
  },
  // Reasonable timeout for static generation
  staticPageGenerationTimeout: 60,
  // Skip prerendering during build for faster deployment
  ...(process.env.SKIP_BUILD_STATIC_GENERATION === 'true' && {
    experimental: {
      ...nextConfig.experimental,
      isrFlushToDisk: false
    }
  }),
  // Suppress hydration warnings from browser extensions
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Additional webpack configuration to suppress warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    // Ignore mongoose during client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        mongodb: false,
        mongoose: false,
      };
    }
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
