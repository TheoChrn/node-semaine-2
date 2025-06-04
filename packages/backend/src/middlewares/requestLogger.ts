import type { Request, Response, NextFunction } from "express";

export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(`[${request.method}] - ${request.path}`);
  next();
};
