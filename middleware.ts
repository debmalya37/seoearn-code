// middleware.ts (must be in root)
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_EMAILS = [
  'debmalyasen37@gmail.com',
  'souvik007b@gmail.com',
  'sb@gmail.com',
  'seoearningspace@gmail.com',
  'yashverdhan01@gamil.com',
  'debmalyasen15@gmail.com',
  'test@gmail.com',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  console.log('middleware token',token);

  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
     url.pathname.startsWith('/sign-up') ||
     url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/taskfeed', request.url));
  }

  if (!token && url.pathname.startsWith('/Profile')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (url.pathname.startsWith('/Admin')) {
    if (!token || !ADMIN_EMAILS.includes(token.email || '')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/verify',
    '/taskfeed',
    '/CreateAdvertisement',
    '/wallet',
    '/mysubmissions',
    '/Profile',
    '/dashboard/:path*',
    '/Admin/:path*',
  ],
};
