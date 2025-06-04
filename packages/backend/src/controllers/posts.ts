import { logger } from "@/utils/logger";
import { APIResponse } from "@/utils/response";
import type { Request, Response } from "express";

export const post = {
  getAllPosts: (_: Request, response: Response) => {
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
      APIResponse(response, posts);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      logger.error(`[ERROR] - ${errorMessage}`);
      APIResponse(response, null, errorMessage, 500);
    }
  },
};
