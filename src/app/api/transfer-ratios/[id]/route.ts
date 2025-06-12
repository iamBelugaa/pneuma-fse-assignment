import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions, getCurrentUserId } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import { idSchema } from '@/lib/schemas';
import { updateTransferRatioSchema } from '@/lib/schemas/ratio.schema';
import { validateInput } from '@/lib/validation';
import { transferRatioRepository } from '@/repositories';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _: NextRequest,
  { params }: IRouteParams
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    }

    const validation = validateInput(idSchema, id);
    if (!validation.success) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: validation.error,
        })
      );
    }

    const transferRatio = await transferRatioRepository.findById(id);
    if (!transferRatio) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 404,
          message: 'Transfer ratio not found',
        })
      );
    }

    return ResponseBuilder.success(200, transferRatio);
  } catch (error) {
    console.error(`Error in GET /api/transfer-ratios/${id}:`, error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch transfer ratio',
      })
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: IRouteParams
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    const userId = getCurrentUserId(session);

    if (!userId) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    }

    const validationId = validateInput(idSchema, id);

    if (!validationId.success) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: validationId.error,
        })
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(updateTransferRatioSchema, body);

    if (!validation.success) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: validation.error,
        })
      );
    }

    const updatedRatio = await transferRatioRepository.update(
      id,
      validation.data,
      userId
    );

    return ResponseBuilder.success(200, {
      ...updatedRatio,
      message: 'Transfer ratio updated successfully',
    });
  } catch (error) {
    console.error(`Error in PUT /api/transfer-ratios/${id}:`, error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update transfer ratio',
      })
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: IRouteParams
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    const userId = getCurrentUserId(session);

    if (!userId) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    }

    const validationId = validateInput(idSchema, id);

    if (!validationId.success) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: validationId.error,
        })
      );
    }

    await transferRatioRepository.delete(id);
    return ResponseBuilder.success(200, {
      message: 'Transfer ratio archived successfully',
    });
  } catch (error) {
    console.error(`Error in DELETE /api/transfer-ratios/${id}:`, error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to archive transfer ratio',
      })
    );
  }
}
