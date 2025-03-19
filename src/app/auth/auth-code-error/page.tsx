import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            There was a problem with the authentication process.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 