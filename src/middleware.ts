import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no session and the user is trying to access a protected route
  // Protected routes: everything except /login and /
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/';
  
  if (!session && !isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // If there is a session and the user is on the login page, redirect to timeline
  if (session && req.nextUrl.pathname === '/login') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/timeline';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (auth callback route)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
};