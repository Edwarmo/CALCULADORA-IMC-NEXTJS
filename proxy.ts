/**
 * Proxy Module - Next.js 16 middleware replacement
 * 
 * This file handles request/response interception for authentication
 * and route protection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/infrastructure/auth/jwt-service';

// Define protected and public routes
export const protectedRoutes = ['/dashboard', '/calculator'];
export const publicRoutes = ['/login', '/register', '/'];
export const legacyRoutes = {
  '/web/login': '/login',
  '/web/register': '/register',
  '/web/dashboard': '/dashboard/calculator',
};

/**
 * Next.js 16 proxy function
 * Runs before each request to handle authentication
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle legacy route redirects
  for (const [legacy, current] of Object.entries(legacyRoutes)) {
    if (pathname.startsWith(legacy)) {
      return NextResponse.redirect(new URL(current, request.url));
    }
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Skip if public route or static files
  if (isPublicRoute || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify token
    const payload = authService.verifyToken(token);
    if (!payload) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Next.js 16 config export for route matching
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
