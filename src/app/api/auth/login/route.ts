import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // For demo purposes, check against hardcoded credentials
    // In production, you should check against database users
    const ADMIN_EMAIL = 'admin@portfolio.com';
    const ADMIN_PASSWORD = 'admin123'; // Change this in production!

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { email, isAdmin: true },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set HTTP-only cookie
      const response = NextResponse.json({ 
        message: 'Login successful',
        user: { email, isAdmin: true }
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}