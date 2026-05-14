import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';

  // Define protected and public routes
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/auth');

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthPage && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
