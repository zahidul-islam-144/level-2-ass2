import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';
// import { TSafeParse } from '../../utils/types';

export type TSafeParse<T> =
{ success: boolean; data?: T | null, errors?: any}

export default <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): TSafeParse<T> => {
    try {
      const parsedData = schema.parse(req.body);
      // console.log('--> parsedData:', parsedData)
      next();
      return { success: true, data: parsedData };
    } catch (errors) {
      if (errors instanceof ZodError) {
        console.log('--> errors:', errors)
        return { success: false, errors };
      } else {
        throw errors;
      }
    }
  };
