import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

import { authOptions, getCurrentUserId } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import {
  createProgramSchema,
  programQuerySchema,
} from '@/lib/schemas/program.schema';
import { programService, uploadService } from '@/services';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const queryParams = {
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    };

    const validationResult = programQuerySchema.safeParse({
      page: queryParams.page ? parseInt(queryParams.page) : 0,
      pageSize: queryParams.pageSize ? parseInt(queryParams.pageSize) : 20,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        message: err.message,
        field: err.path.join('.'),
      }));

      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'Invalid query parameters',
          fields: { details: errors },
        })
      );
    }

    const result = await programService.getAllPrograms(
      validationResult.data,
      userId
    );

    const response = result.programs.map(async (program) => {
      if (program.assetName) {
        try {
          const imageUrl = await uploadService.generatePresignedViewUrl(
            program.assetName
          );
          return { ...program, imageUrl };
        } catch (error) {
          console.error(
            `Error generating URL for ${program.assetName}:`,
            error
          );
          return program;
        }
      }
      return program;
    });

    const programsWithUrls = await Promise.all(response);
    return ResponseBuilder.success(200, {
      ...result,
      programs: programsWithUrls,
    });
  } catch (error) {
    console.error('GET /api/programs error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to fetch programs',
      })
    );
  }
}

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
    console.log('Received program data:', JSON.stringify(rawBody, null, 2));

    const validationResult = createProgramSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        message: err.message,
        field: err.path.join('.'),
      }));

      console.error('Validation errors:', errors);
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'Validation failed',
          fields: { details: errors },
        })
      );
    }

    const validatedData = validationResult.data;
    let program = await programService.createProgram(validatedData, userId);

    if (program?.assetName) {
      try {
        const imageUrl = await uploadService.generatePresignedViewUrl(
          program.assetName
        );
        program = { ...program, imageUrl } as typeof program;
      } catch (error) {
        console.error(`Error generating URL for ${program?.assetName}:`, error);
      }
    }

    console.log('Created program:', JSON.stringify(program, null, 2));
    return ResponseBuilder.success(201, program);
  } catch (error) {
    console.error('POST /api/programs error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message:
          error instanceof Error ? error.message : 'Failed to create program',
      })
    );
  }
}
