import { and, eq } from "drizzle-orm";

import type { NewComment, UpdateComment } from "@/db/entities//comments";
import { schema } from "@/db/schemas";

import { db } from "@/db/config/pool";
import { type UserRole } from "@/db/schemas/users";
import { logger } from "@/utils/logger";

export const comment = {
  create: async (
    input: Pick<NewComment, "authorId" | "content" | "featureId" | "parentId">
  ) => {
    return db.insert(schema.comments).values(input);
  },
  delete: async (input: { id: string; userId: string; role: UserRole }) => {
    if (input.role === "admin") {
      return db.delete(schema.comments).where(eq(schema.comments.id, input.id));
    } else {
      return db
        .delete(schema.comments)
        .where(
          and(
            eq(schema.comments.id, input.id),
            eq(schema.comments.authorId, input.userId)
          )
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
        `Impossible de mettre à jour le commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },

  getAll: async () => {
    try {
      return db.query.comments.findMany({
        columns: {
          content: true,
        },
      });
    } catch (error) {
      logger.error(
        `Impossible de récupérer  les commentaire: ${
          error instanceof Error ? error.message : ""
        }`
      );
    }
  },
};
