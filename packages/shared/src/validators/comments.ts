import { z } from "zod";

export const createCommentSchema = z.object({
  title: z.string().min(1, "A title is required"),
  content: z.string().min(1, "A content is required"),
});
export const updateCommentSchema = createCommentSchema.extend({
  id: z.string(),
});
