import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler:ErrorRequestHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err?.statusCode || 500;
    err.message = err?.message || "Something went wrong.";
    console.log('_err:',err.name, err)
    if (!err) {
      return next();
    }

    

  // handle application error

  // global error response
  res.status(err.statusCode).json({
    success: false,
    statusCode: err?.statusCode,
    messages: err?.message,
    details: err.errors || []
  });
}