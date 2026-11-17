// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ignore internal Next.js paths and static files
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path === '/favicon.ico' ||
    path.startsWith('/images')
  ) {
    return NextResponse.next();
  }

  const publicAuthPages = [
    '/auth/login',
    '/auth/signup',
    '/auth/signup/host',
    '/auth/signup/user',
  ];

  const roleHomes: Record<string, string> = {
    admin: '/admin/events',
    host: '/host/events',
    user: '/user/events',
  };

  const protectedPaths = [
    { path: '/admin', role: 'admin' },
    { path: '/create', role: ['admin', 'host'] },
    { path: '/host', role: 'host' },
    { path: '/user', role: 'user' },
    { path: '/profile', role: ['user', 'admin', 'host'] },
  ];

  const protectedPath = protectedPaths.find((p) => path.startsWith(p.path));

  // ✅ استخدم request.cookies.get()
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  if (publicAuthPages.some((p) => path.startsWith(p))) {
    if (token && userRole) {
      const home = roleHomes[userRole] || '/';
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // Role isolation: if logged in, keep each role inside its own area.
  // Admin should not access public pages; their "home" is the admin dashboard landing page.
  if (token && userRole) {
    const home = roleHomes[userRole] || '/';

    const allowedCommon =
      path === '/' ||
      path.startsWith('/profile') ||
      path.startsWith('/unauthorized');

    if (userRole === 'admin') {
      const allowedAdmin =
        path.startsWith('/admin') ||
        publicAuthPages.some((p) => path.startsWith(p)) ||
        allowedCommon;

      if (!allowedAdmin) {
        return NextResponse.redirect(new URL(home, request.url));
      }

      if (path === '/') {
        return NextResponse.redirect(new URL(home, request.url));
      }
    }
  }

  if (protectedPath) {
    if (!token || !userRole) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const requiredRole = protectedPath.role;
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } else {
      if (userRole !== requiredRole) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}
