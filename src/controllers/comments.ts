import { Request, Response } from "express";
import { APIResponse } from "../utils/response";

export const getAllComments = (request: Request, response: Response) => {
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
};
