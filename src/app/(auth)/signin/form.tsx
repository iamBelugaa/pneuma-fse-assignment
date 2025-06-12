'use client';

import { SigninForm } from '@/components/forms/auth/signin-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SigninFormContainer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(undefined);

    try {
      const result = await signIn('credentials', {
        email: email,
        redirect: false,
        password: password,
      });

      if (!result || result.error || !result.ok) {
        setAuthError(
          result?.error === 'CredentialsSignin'
            ? 'Invalid email or password'
            : 'An error occurred during sign in'
        );
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SigninForm
      error={authError}
      onSubmit={handleSignIn}
      isSubmitting={isLoading}
    />
  );
};

export default SigninFormContainer;
