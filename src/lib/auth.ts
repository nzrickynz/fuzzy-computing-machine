import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    // Log the payload to see its structure
    console.log('Token payload:', verified.payload);
    // Ensure we're getting a string
    if (typeof verified.payload.userId !== 'string') {
      console.log('userId is not a string:', verified.payload.userId);
      return null;
    }
    return { userId: verified.payload.userId as string };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function getUser() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setUserCookie(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function removeUserCookie() {
  cookies().delete('token');
} 