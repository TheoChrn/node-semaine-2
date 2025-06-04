import { schema } from "@/db/schemas";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Post = InferSelectModel<typeof schema.posts>;
export type NewPost = InferInsertModel<typeof schema.posts>;
