import {
  ApplicationError,
  ErrorResponse,
  HttpError,
  SuccessResponse,
} from '@/types/response';
import { NextResponse } from 'next/server';

export class ResponseBuilder {
  public static error<E = ApplicationError | unknown>(e: E) {
    let error: ErrorResponse;

    if (e instanceof ApplicationError) {
      error = new ErrorResponse(e.error);
    } else {
      error = new ErrorResponse({
        statusCode: 500,
        message: e instanceof Error ? e.message : 'Internal Server Error',
      });
    }

    return NextResponse.json(error, { status: error.error.statusCode });
  }

  public static success<T = unknown>(code: number, data: T) {
    return NextResponse.json(new SuccessResponse(data), { status: code });
  }

  public static toAppError(error: HttpError) {
    return new ApplicationError(error);
  }
}
