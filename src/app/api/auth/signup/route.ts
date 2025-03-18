import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/lib/auth';

// Force Node.js runtime
export const runtime = 'nodejs';
export const preferredRegion = 'iad1'; // US East (N. Virginia)

export async function POST(request: Request) {
  try {
    console.log('[Signup] Starting signup process');
    const body = await request.json();
    console.log('[Signup] Email:', body.email);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      console.log('[Signup] User already exists:', body.email);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
        },
      });
      console.log('[Signup] Created user:', body.email);

      // Generate token
      try {
        const token = await new SignJWT({ userId: user.id })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('24h')
          .sign(getJwtSecretKey());

        // Set cookie
        cookies().set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400, // 24 hours
        });

        console.log('[Signup] Successfully registered user:', body.email);
        return NextResponse.json({
          message: 'User created successfully',
          redirect: '/dashboard'
        });
      } catch (error) {
        console.error('[Signup] Token generation failed:', error);
        return NextResponse.json(
          { message: 'Authentication failed' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('[Signup] User creation failed:', error);
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Signup] Unexpected error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 