import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Protected routes that require authentication
  const protectedRoutes = ['/admin'];
  const { pathname } = request.nextUrl;

  // Check if the path is protected and token is valid
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }

    try {
      // Verify token
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};