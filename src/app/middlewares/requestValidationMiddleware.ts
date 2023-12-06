import express, { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import CustomError from '../utils/CustomError';

export default (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody = req.body;
      console.log('---> Validation:req', reqBody);
      await schema.parseAsync({
        body: reqBody,
      });

      next();
    } catch (errors) {
      next(new CustomError('Data Validation error.', 406, errors));
    }
  };
