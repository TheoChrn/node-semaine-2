import { posts } from "db/schemas";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Post = InferSelectModel<typeof posts>;
export type newPost = InferInsertModel<typeof posts>;
