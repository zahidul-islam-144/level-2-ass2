import { Response } from "express";
import { TSendResponse } from "./types";

export default class CustomResponse {
    private res: Response;
  
    constructor(response: Response) {
      this.res = response;
    }
  
    sendResponse<T>(data: TSendResponse<T>) {
      this.res.status(data?.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
      });
    }
  }