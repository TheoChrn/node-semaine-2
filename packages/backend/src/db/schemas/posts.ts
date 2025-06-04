import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { comments } from "../schemas/comments";
import { users } from "../schemas/users";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postRelation = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "user_posts",
  }),
  comments: many(comments, { relationName: "post_comments" }),
}));
