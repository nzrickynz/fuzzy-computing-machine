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

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT Secret key is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}

export async function getUser() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return payload;
  } catch (error) {
    console.error('[Auth] Get user failed:', error);
    return null;
  }
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

export async function getAuthStatus() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
} 