import { schema } from "@/db/schemas";
import type { InferSelectModel } from "drizzle-orm";

export type BaseFeature = InferSelectModel<typeof schema.features>;
