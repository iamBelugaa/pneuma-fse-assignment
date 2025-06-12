export enum ApiStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export type HttpError = {
  message: string;
  statusCode: number;
  fields?: Record<string, unknown>;
};

export class SuccessResponse<T = unknown> {
  public status = ApiStatus.OK;
  constructor(public data: T) {}
}

export class ErrorResponse<E = HttpError> {
  public status = ApiStatus.ERROR;
  constructor(public error: E) {}
}

export class ApplicationError {
  constructor(private e: HttpError) {}
  public get error() {
    return Object.freeze(this.e);
  }
}

export type PaginationMeta = {
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;
};
