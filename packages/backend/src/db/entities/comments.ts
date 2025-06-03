import { comments } from "db/schemas";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;
