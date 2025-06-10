import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const interSans = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pneuma FSE Assignment',
  description:
    'Frequent Flyer Programs and their transfer ratios with credit card partners.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('antialiased', interSans.className)}>{children}</body>
    </html>
  );
}
