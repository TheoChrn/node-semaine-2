import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../schemas/users";
import { features } from "@/db/schemas/features";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  parentId: uuid("parent_id"),
  featureId: uuid("feature")
    .references(() => features.id, { onDelete: "cascade" })
    .notNull(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: "replies",
  }),
  feature: one(features, {
    fields: [comments.featureId],
    references: [features.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, {
    relationName: "replies",
  }),
}));
