/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { ISessionUser } from '@/types/user';
import prisma from './prisma';
import { signinSchema } from './schemas/user.schema';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        try {
          // Validate input format before hitting the database
          const validatedCredentials = signinSchema.parse(credentials);

          // Find user in database
          const user = await prisma.user.findUnique({
            select: { id: true, email: true, password: true },
            where: { email: validatedCredentials.email.toLowerCase() },
          });

          // Check if user exists.
          if (!user) {
            console.log(
              `Login attempt failed: User not found for email ${validatedCredentials.email}`
            );
            return null;
          }

          // Verify password using bcrypt.
          const isPasswordValid = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(
              `Login attempt failed: Invalid password for email ${validatedCredentials.email}`
            );
            return null;
          }

          console.log(`User ${user.email} logged in successfully`);
          return { id: user.id, email: user.email };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
        } as ISessionUser;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: { error: '/login', signIn: '/signin', newUser: '/signup' },
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 14);
}

export function isAuthenticated(
  session: any
): session is { user: ISessionUser } {
  return session && session.user && session.user.id;
}

export function getCurrentUserId(session: any): string | null {
  if (!isAuthenticated(session)) {
    return null;
  }
  return session.user.id;
}
