import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface UseAuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export function useAuthForm({ mode, onSuccess }: UseAuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
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
        onSuccess?.();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
} 