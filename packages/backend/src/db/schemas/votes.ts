import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { features } from "@/db/schemas/features";
import { users } from "./users";

const voteValuesEnum = ["up", "down"] as const;
export type VoteValues = typeof voteValuesEnum;
export type Vote = VoteValues[number];

export const voteValues = {
  UP: "up",
  DOWN: "down",
} as const satisfies Record<string, Vote>;

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    value: text({ enum: voteValuesEnum }).notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    featureId: uuid("feature_id")
      .references(() => features.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (schema) => ({
    uniqueUserFeature: unique().on(schema.userId, schema.featureId),
  })
);

export const upVotesRelation = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  features: one(features, {
    fields: [votes.featureId],
    references: [features.id],
  }),
}));
