import { db } from "@/db/config/pool";
import type { NewPost, Post } from "@/db/entities/posts";
import { schema } from "@/db/schemas";

import { logger } from "@/utils/logger";
import { createPostSchema, updatePostSchema } from "@monorepo/shared/src/validators";

import { eq } from "drizzle-orm";

export const post = {
  create: async (input: NewPost) => {
    try {
      const validation = createPostSchema.safeParse(input);

      if (!validation.success) return;

      return db.insert(schema.posts).values(input);
    } catch (error) {
      logger.error(
        `Impossible de créer le post: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  delete: async (input: { id: string }) => {
    try {
      return db.delete(schema.posts).where(eq(schema.posts.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de supprimer le post: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  update: async (input: Post) => {
    try {
      const validation = updatePostSchema.safeParse(input);
      if (!validation.success) return;

      return db
        .update(schema.posts)
        .set(input)
        .where(eq(schema.posts.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de mettre à jour le post: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  get: async (input: { id: string }) => {
    try {
      return db.query.posts.findFirst({
        columns: { title: true, content: true },
        where: (comment, { eq }) => eq(comment.id, input.id),
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer le post: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
  getAll: async () => {
    try {
      return db.query.posts.findMany({
        columns: {
          title: true,
          content: true,
        },
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer les post: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },
};
