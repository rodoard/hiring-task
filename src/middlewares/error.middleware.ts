import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom.error';
import { ArgumentValidationError } from '../errors/argumentValidation.error';
import { Logger } from '../utils/logger';
import httpStatus from 'http-status';
import { Env } from '../env';

export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => { 
  if (Env.nodeEnv !== 'test') {
    Logger.error(JSON.stringify(error));
  }
  
  if (error instanceof CustomError) {
    if(error instanceof ArgumentValidationError) {
      return res.status(error.errorCode).json({
        message: error.message,
        messages: error.messages
      });
    }
    return res.status(error.errorCode).json({
      message: error.message,
    });
  }

  // Handle generic errors
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: errorMessage,
  });
};
