export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We've sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Didn't receive an email?{' '}
            <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Try again
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 