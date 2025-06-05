import { schema } from "@/db/schemas";
import type { InferSelectModel } from "drizzle-orm";

export type BaseVote = InferSelectModel<typeof schema.votes>;
