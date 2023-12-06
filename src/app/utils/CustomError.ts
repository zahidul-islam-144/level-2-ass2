export default class CustomError<T = any> extends Error {
    statusCode: number;
    errors?: T | T[];
  
    constructor(message: string, statusCode: number, errors?: T | T[]) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  