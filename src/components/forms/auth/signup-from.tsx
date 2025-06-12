'use client';

import { Eye, EyeOff, GalleryVerticalEnd, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FormEventHandler, useState } from 'react';

interface IProps {
  error?: string;
  className?: string;
  isSubmitting?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function SignUpForm({
  error,
  onSubmit,
  className,
  isSubmitting,
}: IProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <form className="w-[25rem]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </div>
            <h1 className="text-xl font-bold">Welcome to Pneuma Inc.</h1>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-3 relative">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute cursor-pointer inset-y-11 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <Button
            type={isSubmitting ? 'button' : 'submit'}
            className={cn('w-full', isSubmitting && 'cursor-not-allowed')}
          >
            {isSubmitting ? <Loader className="animate-spin" /> : 'Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
}
