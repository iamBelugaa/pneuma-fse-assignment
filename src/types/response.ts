/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;
}

export enum ErrorCode {
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export interface IAppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
