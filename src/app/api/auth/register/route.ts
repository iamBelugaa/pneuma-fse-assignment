import { NextRequest, NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ResponseBuilder } from '@/lib/response';
import { signupSchema } from '@/lib/schemas/user.schema';
import { isValidEmail } from '@/lib/utils';
import { validateInput } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = validateInput(signupSchema, body);

    if (!validation.success) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: validation.error,
        })
      );
    }

    const { email, password } = validation.data;
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    if (existingUser) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 409,
          message:
            'An account with this email already exists. Please use a different email or try signing in.',
        })
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: { email: email.toLowerCase(), password: hashedPassword },
      select: { id: true, email: true, createdAt: true },
    });

    console.log(`New user registered: ${newUser.email} (ID: ${newUser.id})`);

    return ResponseBuilder.success(201, {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return ResponseBuilder.error(
          ResponseBuilder.toAppError({
            statusCode: 409,
            message:
              'An account with this email already exists. Please use a different email or try signing in.',
          })
        );
      }
    }

    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          'An error occurred while creating your account. Please try again.',
      })
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'Email parameter is required',
        })
      );
    }

    if (!isValidEmail(email)) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'Invalid email format',
        })
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    const isAvailable = !existingUser;

    return ResponseBuilder.success(200, {
      email,
      available: isAvailable,
      message: isAvailable
        ? 'Email is available'
        : 'Email is already registered',
    });
  } catch (error) {
    console.error('Error in GET /api/auth/register:', error);

    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to check email availability',
      })
    );
  }
}
