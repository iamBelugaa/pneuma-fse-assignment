import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

import { authOptions, getCurrentUserId } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import { createTransferRatioSchema } from '@/lib/schemas/ratio.schema';
import { transferRatioService } from '@/services';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getCurrentUserId(session);
    if (!userId) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 401,
          message: 'Unauthorized',
        })
      );
    }

    const rawBody = await request.json();
    const validationResult = createTransferRatioSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'Validation failed',
          fields: { details: errors },
        })
      );
    }

    const validatedData = validationResult.data;
    const transferRatio = await transferRatioService.createTransferRatio(
      validatedData,
      userId
    );

    return ResponseBuilder.success(201, transferRatio);
  } catch (error) {
    console.error('POST /api/transfer-ratios error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create transfer ratio',
      })
    );
  }
}
