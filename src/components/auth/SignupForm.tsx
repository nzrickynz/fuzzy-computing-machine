'use client';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { useAuthForm } from '@/hooks/useAuthForm';
import Link from 'next/link';

export function SignupForm() {
  const { formData, error, loading, handleChange, handleSubmit } = useAuthForm({
    mode: 'signup',
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

        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
} 