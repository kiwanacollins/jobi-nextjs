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
    '/company/:id',
    '/company',
    '/faq',
    '/terms',
    '/termsofuses',
    '/policy',
    '/pricing',
    '/blogs',
    '/blog/:id',
    '/api/webhook'
  ],
  ignoredRoutes: ['/api/webhook', '/src/api/webhook']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
