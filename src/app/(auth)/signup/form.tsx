'use client';

import { SignUpForm } from '@/components/forms/auth/signup-from';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const SignUpFormContainer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<
    string | undefined
  >();

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    setRegistrationError(undefined);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Success', {
        description: 'Registration successful. Please sign in.',
      });
      router.push('/signin');
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      onSubmit={handleSignUp}
      isSubmitting={isLoading}
      error={registrationError}
    />
  );
};

export default SignUpFormContainer;
