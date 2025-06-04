import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { schema } from "@/db//schemas";

export type Comment = InferSelectModel<typeof schema.comments>;
export type UpdateComment = Omit<Comment, "updatedAt" | "createdAt">;
export type NewComment = InferInsertModel<typeof schema.comments>;
