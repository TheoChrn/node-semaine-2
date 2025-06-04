import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "A title is required"),
  content: z.string().min(1, "A content is required"),
});
export const updatePostSchema = createPostSchema.extend({
  id: z.string(),
});
