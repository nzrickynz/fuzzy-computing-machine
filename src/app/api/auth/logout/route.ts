import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Delete the auth token cookie
  cookies().delete('token');
  
  return NextResponse.json({ success: true });
} 