import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import { uploadService } from '@/services';

export async function POST(request: NextRequest): Promise<NextResponse> {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'File and fileName are required',
        })
      );
    }

    const uploadedFileName = await uploadService.uploadFile(
      file,
      fileName,
      file.type
    );

    console.log(
      `File uploaded successfully: ${uploadedFileName} by user ${session.user?.email}`
    );

    return ResponseBuilder.success(201, {
      fileName: uploadedFileName,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Internal server error during upload',
      })
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'fileName parameter is required',
        })
      );
    }

    await uploadService.deleteFile(fileName);
    console.log(
      `File deleted successfully: ${fileName} by user ${session.user?.email}`
    );

    return ResponseBuilder.success(200, {
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/upload:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to delete file',
      })
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const contentType = searchParams.get('contentType');
    const action = searchParams.get('action');
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600');

    if (!fileName) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({
          statusCode: 400,
          message: 'fileName parameter is required',
        })
      );
    }

    let url: string;

    if (action === 'upload') {
      if (!contentType) {
        return ResponseBuilder.error(
          ResponseBuilder.toAppError({
            statusCode: 400,
            message: 'contentType is required for upload action',
          })
        );
      }
      url = await uploadService.generatePresignedUploadUrl(
        fileName,
        contentType,
        expiresIn
      );
    } else {
      url = await uploadService.generatePresignedViewUrl(fileName, expiresIn);
    }

    return ResponseBuilder.success(200, {
      url,
      fileName,
      expiresIn,
      action: action || 'view',
    });
  } catch (error) {
    console.error('Error in GET /api/upload:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to process upload request',
      })
    );
  }
}
