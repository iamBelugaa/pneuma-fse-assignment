'use client';

import { SignUpForm } from '@/components/forms/auth/signup-from';
import { ApiStatus } from '@/types/response';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const SignUpFormContainer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSignIn = async (email: string, password: string) => {
    const loginResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!loginResult || loginResult.error || !loginResult.ok) {
      toast.error('Please sign in again.', {
        description: 'An error occurred during sign in.',
      });
      router.push('/signin');
      return;
    }

    toast.success('Welcome to Frequent Flyer Programs.');
    router.replace('/');
    router.refresh();
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const registerResult = await response.json();
      if (!response.ok || registerResult.status !== ApiStatus.OK) {
        throw new Error(registerResult.error || 'Registration failed.');
      }

      toast.success('Registration successful. Signing you in.');
      await handleSignIn(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      error={error}
      onSubmit={handleSignUp}
      isSubmitting={isLoading}
    />
  );
};

export default SignUpFormContainer;
