'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ...(mode === 'signup' && { confirmPassword: '' }),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = mode === 'login'
        ? await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })
        : await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        if (mode === 'login') {
          router.push('/dashboard');
        } else {
          router.push('/auth/verify-email');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {mode === 'signup' && (
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
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
      <p className="text-center text-sm text-gray-400">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:text-blue-400">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-400">
              Sign in
            </a>
          </>
        )}
      </p>
    </form>
  );
} 