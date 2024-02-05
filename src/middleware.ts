import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/register(.*)',
    '/jobs',
    '/jobs(.*)',
    '/candidates',
    '/candidate-profile(.*)',
    '/candidates(.*)',
    '/about',
    '/contact',
    '/blog',
    '/api/webhook'
  ],
  ignoredRoutes: ['/api/webhook', '/src/app/api/webhook'],
  async afterAuth(auth, req, evt) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }
    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      //  If user tries to access a private route without being authenticated,
      //  redirect them to the sign in page
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
