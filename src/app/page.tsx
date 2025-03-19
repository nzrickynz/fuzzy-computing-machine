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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              Stashio
            </Link>
          </div>
          <div>
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                View Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white mr-8"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Only show marketing content if not authenticated */}
      {!user && (
        <>
          {/* Hero Section */}
          <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Never Lose Another</span>
                <span className="block text-indigo-400">Brilliant Idea</span>
              </h1>
              <p className="max-w-md mx-auto mt-3 text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Stashio is your digital brain for capturing code snippets, solutions, and programming insights instantly. Perfect for developers who want to build their personal knowledge base.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Developer Use Case */}
                <div className="p-6 border border-gray-700 rounded-lg">
                  <h3 className="text-xl font-bold text-indigo-400 mb-4">For Developers</h3>
                  <p className="text-gray-300">
                    Save and organize code snippets, solutions, and debugging insights. Tag them for easy retrieval when you need them most.
                  </p>
                </div>

                {/* Team Use Case */}
                <div className="p-6 border border-gray-700 rounded-lg">
                  <h3 className="text-xl font-bold text-indigo-400 mb-4">For Teams</h3>
                  <p className="text-gray-300">
                    Build a shared knowledge base of code solutions, best practices, and project-specific snippets. Keep your team's knowledge organized and accessible.
                  </p>
                </div>

                {/* Personal Use Case */}
                <div className="p-6 border border-gray-700 rounded-lg">
                  <h3 className="text-xl font-bold text-indigo-400 mb-4">For Learning</h3>
                  <p className="text-gray-300">
                    Create your personal programming library. Save tutorials, examples, and learning resources with smart tagging for quick reference.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">How Stashio Works</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400 mb-2">1</div>
                  <h3 className="text-xl font-semibold mb-2">Capture</h3>
                  <p className="text-gray-300">Quickly save code snippets and solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400 mb-2">2</div>
                  <h3 className="text-xl font-semibold mb-2">Organize</h3>
                  <p className="text-gray-300">Use #tags and @projects to categorize</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400 mb-2">3</div>
                  <h3 className="text-xl font-semibold mb-2">Find</h3>
                  <p className="text-gray-300">Search and filter to find what you need</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400 mb-2">4</div>
                  <h3 className="text-xl font-semibold mb-2">Use</h3>
                  <p className="text-gray-300">Copy and reuse your saved solutions</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-extrabold mb-8">Start Building Your Code Library Today</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join developers who trust Stashio to keep their code snippets organized and accessible.
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Sign Up Now - It's Free
              </Link>
            </div>
          </section>
        </>
      )}

      {/* Show redirect message if authenticated */}
      {user && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome Back!</h1>
          <p className="text-xl mb-8">Ready to add more code snippets?</p>
          <Link
            href="/dashboard"
            className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
} 