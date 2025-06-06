import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "A content is required"),
  parentId: z
    .string()
    .uuid()
    .optional()
    .transform((val) => val || null),
});
export const updateCommentSchema = createCommentSchema.extend({
  id: z.string(),
});
