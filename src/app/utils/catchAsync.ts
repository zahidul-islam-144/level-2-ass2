import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

export default (asyncFunction: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): any => {
    return Promise.resolve(asyncFunction(req, res, next)).catch((error) => {
      console.log('---> catchAsyc:error', error);
      next(error);
    });
  };
// Promise.resolve(fn(req, res, next)).catch((err) => next(err));
