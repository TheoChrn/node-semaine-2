import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "../schemas/users";
import { comments } from "@/db/schemas/comments";

export const features = pgTable("features", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdBy: uuid("created_by")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const featuresRelation = relations(features, ({ one, many }) => ({
  user: one(users, {
    fields: [features.createdBy],
    references: [users.id],
  }),
  comments: many(comments),
}));
