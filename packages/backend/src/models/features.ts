import { db } from "@/db/config/pool";

import { logger } from "@/utils/logger";

import { schema } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export const feature = {
  create: async (input: CreateFeatureInput) => {
    try {
      return db.insert(schema.features).values(input);
    } catch (error) {
      logger.error(
        `Impossible de créer le user: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    }
  },

  delete: async (input: { id: string }) => {
    return db.delete(schema.features).where(eq(schema.features.id, input.id));
  },
  update: async (input: UpdateFeature) => {
    return db
      .update(schema.features)
      .set({
        title: input.title,
        description: input.description,
      })
      .where(
        and(
          eq(schema.features.id, input.id),
          eq(schema.features.createdBy, input.userId)
        )
      );
  },
  get: async (input: { id: string }) => {
    return db.query.features.findFirst({
      columns: { title: true, description: true, createdBy: true },
      where: (feature, { eq }) => eq(feature.id, input.id),
    });
  },
  getAll: async () => {
    try {
      return db.query.features.findMany({
        columns: {
          title: true,
          description: true,
          createdBy: true,
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
