import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default async function HomePage() {
  const token = cookies().get('token')?.value;
  const isAuthenticated = token && (await verifyToken(token));

  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
} 