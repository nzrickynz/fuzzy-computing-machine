import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    console.log('[Login] Starting login process');
    const body = await request.json();
    
    // Validate input
    try {
      loginSchema.parse(body);
    } catch (error) {
      console.error('[Login] Invalid input:', error);
      return NextResponse.json(
        { message: 'Invalid input format' },
        { status: 400 }
      );
    }

    console.log('[Login] Email:', body.email);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      console.log('[Login] User not found:', body.email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await compare(body.password, user.password);
    if (!passwordValid) {
      console.log('[Login] Invalid password for user:', body.email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    try {
      const secret = getJwtSecretKey();
      const token = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret);

      // Set cookie
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 hours
        path: '/',
      });

      console.log('[Login] Successfully logged in user:', body.email);
      return NextResponse.json({
        message: 'Login successful',
        redirect: '/dashboard'
      });
    } catch (error) {
      console.error('[Login] Token generation failed:', error);
      return NextResponse.json(
        { message: 'Authentication failed - token generation error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Login] Unexpected error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 