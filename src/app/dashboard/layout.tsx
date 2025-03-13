import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/shared/UserMenu';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function getUser() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      console.log('No token found');
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.log('Invalid token payload');
      return null;
    }

    console.log('Payload received:', payload);
    
    // Ensure userId is a string
    if (typeof payload.userId !== 'string') {
      console.log('userId is not a string:', payload.userId);
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      },
      select: {
        email: true
      }
    });

    if (!user) {
      console.log('No user found with id:', payload.userId);
    }

    return user;
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Stashio</h1>
            <UserMenu email={user.email} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 