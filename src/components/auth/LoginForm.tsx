'use client';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { useAuthForm } from '@/hooks/useAuthForm';
import Link from 'next/link';

export function LoginForm() {
  const { formData, error, loading, handleChange, handleSubmit } = useAuthForm({
    mode: 'login',
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          error={error}
        />

        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
} 