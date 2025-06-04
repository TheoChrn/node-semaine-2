import { schema } from "@/db/schemas";
import type { InferSelectModel } from "drizzle-orm";

export type BaseUser = InferSelectModel<typeof schema.users>;
