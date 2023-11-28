import express, { Request, Response, NextFunction } from 'express';

export default (asyncFunction: any) =>
  (req: Request, res: Response, next: NextFunction): any => {
    return Promise.resolve(asyncFunction(req, res, next)).catch(next);
  };
