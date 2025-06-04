import { features } from "@/db/schemas/features";
import { comments } from "../schemas/comments";
import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

const userRole = ["user", "admin"] as const;
export type UserRoleValues = typeof userRole;
export type UserRole = UserRoleValues[number];

export const userRolesValues = {
  USER: "user",
  ADMIN: "admin",
} as const satisfies Record<string, UserRole>;

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: text({ enum: userRole }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  features: many(features),
}));
