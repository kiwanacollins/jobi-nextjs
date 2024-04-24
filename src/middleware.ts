import { authMiddleware } from '@clerk/nextjs';
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/register(.*)',
    '/job/:id',
    '/jobs',
    '/jobs(.*)',
    '/candidates',
    '/candidate-profile(.*)',
    '/candidates(.*)',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/pricing',
    '/blogs',
    '/blog/:id',
    '/api/webhook'
  ],
  ignoredRoutes: ['/api/webhook', '/src/app/api/webhook']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
