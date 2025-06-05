import { db } from "@/db/config/pool";

import { logger } from "@/utils/logger";

import { schema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import {
  createUserSchema,
  updateUserSchema,
} from "@monorepo/shared/src/validators";

export const user = {
  create: async (input: CreateUser) => {
    try {
      const validation = createUserSchema.safeParse(input);

      if (!validation.success) return;

      return db
        .insert(schema.users)
        .values(input)
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          role: schema.users.role,
        })
        .then((rows) => rows[0]!);
    } catch (error) {
      logger.error(
        `Impossible de créer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  getByEmail: async (input: { email: string }) => {
    try {
      const user = await db.query.users.findFirst({
        columns: { id: true, email: true, password: true, role: true },
        where: (user, { eq }) => eq(user.email, input.email),
      });

      return user;
    } catch (error) {
      logger.error(
        `Impossible de créer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  delete: async (input: { id: string }) => {
    try {
      return db.delete(schema.users).where(eq(schema.users.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de supprimer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  update: async (input: User) => {
    try {
      const validation = updateUserSchema.safeParse(input);
      if (!validation.success) return;

      return db
        .update(schema.users)
        .set(input)
        .where(eq(schema.users.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de mettre à jour le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  get: async (input: { id: string }) => {
    try {
      return db.query.users.findFirst({
        columns: { email: true, password: true },
        where: (comment, { eq }) => eq(comment.id, input.id),
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  getSession: async (input: { id: string }) => {
    try {
      return db.query.users.findFirst({
        columns: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
        where: (comment, { eq }) => eq(comment.id, input.id),
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  getAll: async () => {
    try {
      return db.query.users.findMany({
        columns: {
          email: true,
          password: true,
        },
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer les user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
};
