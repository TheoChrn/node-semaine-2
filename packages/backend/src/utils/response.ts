import type { Response } from "express";

export const APIResponse = ({
  response,
  data = null,
  message,
  status = 200,
}: {
  response: Response;
  data?: any;
  message?: string;
  status?: number;
}) => {
  return response.status(status).json({ status, message, data });
};
