import { Request, Response } from "express";
import { APIResponse } from "../utils/response";
import { logger } from "@/utils/logger";

export const getAllComments = (request: Request, response: Response) => {
  try {
    logger.info("[GET] - Get all comments");
    const comments = [
      {
        id: "uu5",
        content: "abc",
      },
      {
        id: "uu6",
        content: "def",
      },
    ];
    return APIResponse(response, comments);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    logger.error(`[ERROR] - ${errorMessage}`);
    return APIResponse(response, null, errorMessage, 500);
  }
};
