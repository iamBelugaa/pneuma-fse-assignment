import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

import { authOptions, getCurrentUserId } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import { updateProgramSchema } from '@/lib/schemas/program.schema';
import { programService } from '@/services';

interface IRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: IRouteParams) {
  const { id } = await params;

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

    const program = await programService.getProgramById(id, userId);
    return ResponseBuilder.success(200, program);
  } catch (error) {
    console.error('GET /api/programs/[id] error:', error);
    if (error instanceof Error && error.message === 'Program not found') {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 404,
          message: 'Program not found',
        })
      );
    }
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to fetch program',
      })
    );
  }
}

export async function PUT(request: NextRequest, { params }: IRouteParams) {
  try {
    const { id } = await params;
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

    // Handle toggle action
    if (rawBody.action === 'toggle') {
      const program = await programService.toggleProgramEnabled(
        id,
        rawBody.enabled,
        userId
      );
      return ResponseBuilder.success(200, program);
    }

    // Handle regular program update
    const validationResult = updateProgramSchema.safeParse(rawBody);

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

    const program = await programService.updateProgram(
      id,
      validationResult.data,
      userId
    );

    return ResponseBuilder.success(200, program);
  } catch (error) {
    console.error('PUT /api/programs/[id] error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error ? error.message : 'Failed to update program',
      })
    );
  }
}

export async function DELETE(_: NextRequest, { params }: IRouteParams) {
  try {
    const { id } = await params;
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

    await programService.deleteProgram(id, userId);
    return ResponseBuilder.success(200, {
      message: 'Program deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/programs/[id] error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to delete program',
      })
    );
  }
}
