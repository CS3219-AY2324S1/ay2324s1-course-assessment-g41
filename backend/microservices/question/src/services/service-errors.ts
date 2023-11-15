import { MongoError } from "mongodb";

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

const BAD_REQUEST_ERROR_CODES = ['11000', '11001'];

function parseMongoError(error: MongoError): Error {
    const code = String(error.code)
    if (BAD_REQUEST_ERROR_CODES.includes(code)) {
        return new BadRequestError(error.message);
    }
    if (error.message.includes("not found")) {
        return new DataNotFoundError(error.message);
    }
    return new DatabaseError(error.message);
}

export function parseError(error: Error): Error {
    if (error instanceof MongoError) {
        return parseMongoError(error);
    }
    return error;
}