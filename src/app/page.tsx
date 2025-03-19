import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase-server';

async function getUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

export default async function Home() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Stashio</h1>
        <p className="text-center mb-8">Your personal code snippet manager</p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
} 