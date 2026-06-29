import { NextResponse } from 'next/server';

export default function proxy(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;
  const isAuthRoute = path === '/login' || path === '/register';
  const isProtectedRoute = path.startsWith('/dashboard');

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};