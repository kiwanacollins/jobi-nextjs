import './globals.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import { EB_Garamond } from 'next/font/google';
import BackToTopCom from './components/common/back-to-top-com';
import { Providers } from '@/redux/provider';
import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import WhatsAppButton from './components/common/WhatsAppButton';

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
  title: 'Hireskills - Job Portal',
  description: 'Hireskills - Job Porta - Find your dream job today!'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>

        <body
          suppressHydrationWarning={true}
          className={`${gordita.variable} ${garamond.variable}`}
        >
          <NextTopLoader showSpinner={false} />
          <Providers>{children}</Providers>
          <WhatsAppButton
            phoneNumber={'+8801938056537'}
            message="Hello, I would like to know about your services"
          />
          <BackToTopCom />
        </body>
      </html>
    </ClerkProvider>
  );
}
