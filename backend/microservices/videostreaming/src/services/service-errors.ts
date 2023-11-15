import { PostgresError } from '@/clients/postgres';

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DataNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const BAD_REQUEST_ERROR_CODES = ['22P02', '23502', '23505'];
const DATA_NOT_FOUND_ERROR_CODES = ['02000'];

function parsePostgresError(error: PostgresError): Error {
  switch (true) {
    case BAD_REQUEST_ERROR_CODES.includes(error.code):
      return new BadRequestError(error.message);
    case DATA_NOT_FOUND_ERROR_CODES.includes(error.code):
      return new DataNotFoundError(error.message);
    default:
      return new DatabaseError(error.message);
  }
}

export function parseError(error: Error): Error {
  if (error.hasOwnProperty('code')) {
    const postgresError = error as PostgresError;
    return parsePostgresError(postgresError);
  }
  return error;
}
