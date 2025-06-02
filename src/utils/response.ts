import { Response } from "express";

export const APIResponse = (
  response: Response,
  data: any,
  message?: string,
  status: number | undefined = 200
) => {
  response.status(status).json({ status, message, data });
};
