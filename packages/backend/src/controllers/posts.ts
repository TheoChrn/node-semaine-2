import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import { Request, Response } from "express";

export const getAllPosts = (request: Request, response: Response) => {
  try {
    logger.info("[GET] - Get all posts");
    const posts = [
      {
        id: "uu5",
        content: "abc",
      },
      {
        id: "uu6",
        content: "def",
      },
    ];
    return APIResponse(response, posts);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    logger.error(`[ERROR] - ${errorMessage}`);
    return APIResponse(response, null, errorMessage, 500);
  }
};
