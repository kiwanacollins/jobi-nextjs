import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    // '/jobs',
    '/jobs/:id',
    '/candidates',
    '/about-us',
    '/contact',
    '/api/webhook',
    '/dashboard/candidate-dashboard',
    '/register'
  ],
  ignoredRoutes: ['/api/webhook']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
