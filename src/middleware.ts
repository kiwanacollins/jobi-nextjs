import { authMiddleware } from '@clerk/nextjs';
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
  ignoredRoutes: ['/api/webhook', '/src/app/api/webhook']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
