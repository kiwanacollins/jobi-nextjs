import './globals.scss';
import '@/lib/suppress-warnings';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import { EB_Garamond } from 'next/font/google';
import BackToTopCom from '@/components/common/back-to-top-com';
import { Providers } from '@/redux/provider';
import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import HydrationErrorBoundary from '@/components/common/HydrationErrorBoundary';
import AdminInitializer from '@/components/common/AdminInitializer';
import { siteMetadata, buildUrl } from '@/lib/seo';

const gordita = localFont({
  src: [
    {
      path: '../../public/assets/fonts/gordita/gordita_medium-webfont.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_medium-webfont.woff',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_regular-webfont.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/assets/fonts/gordita/gordita_regular-webfont.woff',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--gorditas-font'
});

const garamond = EB_Garamond({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--eb_garamond-font'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.siteName}`
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.siteName,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.siteName, url: siteMetadata.siteUrl }],
  creator: siteMetadata.siteName,
  publisher: siteMetadata.siteName,
  category: 'jobs',
  alternates: {
    canonical: siteMetadata.siteUrl
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
    type: 'website',
    images: [
      {
        url: buildUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: `${siteMetadata.siteName} logo`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: siteMetadata.twitterHandle,
    images: [buildUrl('/logo.png')]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.siteName,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    inLanguage: siteMetadata.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteMetadata.siteUrl}/jobs?query={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteMetadata.siteName,
    url: siteMetadata.siteUrl,
    logo: buildUrl('/logo.png'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: siteMetadata.contactEmail,
      availableLanguage: ['en', 'en-UG']
    }
  };

  const structuredData = JSON.stringify([websiteJsonLd, organizationJsonLd]);

  return (
    <ClerkProvider>
      <html lang="en-UG">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Suppress hydration warnings from browser extensions
                (function() {
                  if (${process.env.NEXT_PUBLIC_SUPPRESS_HYDRATION_WARNINGS === 'true'}) {
                    const originalWarn = console.warn;
                    const originalError = console.error;
                    
                    console.warn = function(...args) {
                      const message = args[0];
                      if (
                        typeof message === 'string' && (
                          message.includes('Extra attributes from the server') ||
                          message.includes('crxlauncher') ||
                          message.includes('chrome-extension') ||
                          message.includes('moz-extension') ||
                          message.includes('Hydration failed') ||
                          message.includes('There was an error while hydrating')
                        )
                      ) {
                        return;
                      }
                      originalWarn.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                      const message = args[0];
                      if (
                        typeof message === 'string' && (
                          message.includes('Extra attributes from the server') ||
                          message.includes('crxlauncher') ||
                          message.includes('chrome-extension') ||
                          message.includes('moz-extension') ||
                          message.includes('Hydration failed') ||
                          message.includes('There was an error while hydrating')
                        )
                      ) {
                        return;
                      }
                      originalError.apply(console, args);
                    };
                  }
                })();
              `
            }}
          />
        </head>

        <body
          suppressHydrationWarning={true}
          className={`${gordita.variable} ${garamond.variable}`}
          style={{ overflowX: 'hidden', maxWidth: '100vw' }}
        >
          <AdminInitializer />
          <HydrationErrorBoundary>
            <NextTopLoader showSpinner={false} />
            <Providers>{children}</Providers>
            <WhatsAppButton
              phoneNumber={''}
              message=""
              groupLink="https://chat.whatsapp.com/Ifc2unpiZTwD6HYk73Qqeh"
            />
            <BackToTopCom />
          </HydrationErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
