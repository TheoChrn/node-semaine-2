import { eq } from "drizzle-orm";

import type { NewComment, UpdateComment } from "@/db/entities//comments";
import { schema } from "@/db/schemas";

import { logger } from "@/utils/logger";
import { db } from "@/db/config/pool";
import { createCommentSchema } from "@monorepo/shared/src/validators";

export const comment = {
  create: async (input: NewComment) => {
    try {
      const validation = createCommentSchema.safeParse(input);

      if (!validation.success) return;

      return db.insert(schema.comments).values(input);
    } catch (error) {
      logger.error(
        `Impossible de créer le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
  delete: async (input: { id: string }) => {
    try {
      return db.delete(schema.comments).where(eq(schema.comments.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de supprimer le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
  update: async (input: UpdateComment) => {
    try {
      return db
        .update(schema.comments)
        .set(input)
        .where(eq(schema.comments.id, input.id));
    } catch (error) {
      logger.error(
        `Impossible de créer le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
  get: async (input: { id: string }) => {
    try {
      return db.query.comments.findFirst({
        columns: { title: true, content: true },
        where: (comment, { eq }) => eq(comment.id, input.id),
      });
    } catch (error) {
      logger.error(
        `Impossible de créer le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
  getAll: async () => {
    try {
      return db.query.comments.findMany({
        columns: {
          title: true,
          content: true,
        },
      });
    } catch (error) {
      logger.error(
        `Impossible de créer le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
};
