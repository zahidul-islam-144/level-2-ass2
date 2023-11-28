import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ErrorResponse } from '../utils/templates';

export const errorMiddleWare:ErrorRequestHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err?.statusCode || 500;
    err.message = err?.message || "Internal Server error.";
    console.log('_err:',err.name, + ":" + err)
    if (!err) {
      return next();
    }

    

  // handle application error
  switch (err.name ) {
    case 'TypeError':
      err.message = 'Invalid arguments. Please, check your codes, syntax, all braces, comma, semicolon are missing or not'
      err.statusCode = 406
      // err = new ErrorResponse('Invalid arguments. Please, check your codes, syntax, all braces, comma, semicolon are missing or not', 406);
      break;
    
    case 'ZodError':
      err.message = 'Zod validation error.'
      err.statusCode = 406
    
    case 'MongoServerError':
      err.message = 'Duplicate data inserting approximation into database.'
      err.statusCode = 406

    case 'MongooseError':
      err.message = 'Check your internet connction or try again.'
      err.statusCode = 404
    
    case 'MongoNetworkTimeoutError':
      err.message = "Connecting with mongoDB server. Try again later."
      err.statusCode = 408
    default:
      break;
  }

  // global error response
  res.status(err.statusCode).json({
    success: false,
    message: err?.message,
    error:{
      statusCode: err?.statusCode,
      message: err?.message,
      details: err.stack || err
    }
  });
}