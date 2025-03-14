import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/brain-repo-logo.png"
                alt="BrainRepo"
                width={150}
                height={150}
                className="h-12 w-auto"
                quality={100}
                priority
              />
            </Link>
          </div>
          <div>
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Never Lose Another</span>
            <span className="block text-indigo-400">Brilliant Idea</span>
          </h1>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            BrainRepo is your digital brain for capturing thoughts, ideas, and tasks instantly. Perfect for busy professionals who don't want to miss a thing.
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
            {/* Agency Use Case */}
            <div className="p-6 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">For Agencies</h3>
              <p className="text-gray-300">
                Capture client suggestions on the fly, track action items for reports, and tag ideas with #client-name for easy filtering. Never miss a valuable insight during client meetings.
              </p>
            </div>

            {/* Business Leaders Use Case */}
            <div className="p-6 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">For Business Leaders</h3>
              <p className="text-gray-300">
                Stay on top of everything when you're spread thin. Quickly capture tasks, ideas, and follow-ups. Keep your mind clear and focused on what matters most.
              </p>
            </div>

            {/* Entrepreneurs Use Case */}
            <div className="p-6 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold text-indigo-400 mb-4">For Entrepreneurs</h3>
              <p className="text-gray-300">
                Turn your constant stream of ideas into organized action items. Use tags like #startup-idea or #product-feature to build your innovation library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How BrainRepo Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">1</div>
              <h3 className="text-xl font-semibold mb-2">Brain Dump</h3>
              <p className="text-gray-300">Quickly capture your thoughts without interrupting your flow</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">2</div>
              <h3 className="text-xl font-semibold mb-2">Tag & Organize</h3>
              <p className="text-gray-300">Use #tags and @mentions to categorize your thoughts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">3</div>
              <h3 className="text-xl font-semibold mb-2">Filter & Find</h3>
              <p className="text-gray-300">Easily retrieve ideas when you need them</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">4</div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-gray-300">Turn your captured thoughts into reality</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-8">Start Capturing Your Ideas Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust BrainRepo to keep their ideas safe and organized.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors"
          >
            Sign Up Now - It's Free
          </Link>
        </div>
      </section>
    </div>
  );
} 