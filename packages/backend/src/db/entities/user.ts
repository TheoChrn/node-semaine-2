import { users } from "db/schemas";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
