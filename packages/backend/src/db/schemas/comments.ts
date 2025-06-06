import { features } from "@/db/schemas/features";
import { relations } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "../schemas/users";

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    parentId: uuid("parent_id"),
    featureId: uuid("feature_id")
      .references(() => features.id, { onDelete: "cascade" })
      .notNull(),
    authorId: uuid("author_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    parentReference: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "comments_parent_id_fkey",
    }).onDelete("cascade"),
  })
);

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
