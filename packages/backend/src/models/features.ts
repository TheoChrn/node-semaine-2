import { db } from "@/db/config/pool";

import { logger } from "@/utils/logger";

import { schema } from "@/db/schemas";
import { groupBy, nestComments, NotFoundError } from "@/utils";
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
  get: async (input: { id: string; userId: string }) => {
    const feature = await db.query.features
      .findFirst({
        columns: { title: true, description: true, createdBy: true },
        with: {
          comments: {
            columns: {
              parentId: true,
              authorId: true,
              id: true,
              content: true,
              createdAt: true,
            },
            with: {
              parent: {
                with: {
                  user: { columns: { email: true } },
                },
                columns: {
                  id: true,
                  authorId: true,
                  content: true,
                  createdAt: true,
                },
              },
              user: {
                columns: { email: true },
              },
            },
            orderBy: (comment, { asc }) => [asc(comment.createdAt)],
          },
          votes: {
            columns: { value: true, userId: true },
          },
        },
        where: (feature, { eq }) => eq(feature.id, input.id),
      })
      .then((row) => ({
        ...row,
        comments: row?.comments ? nestComments(row.comments) : null,
      }));

    if (!feature) {
      throw new NotFoundError("This feature doesn't exist");
    }

    const { votes, ...restFeature } = feature;

    return {
      ...restFeature,
      votes: {
        users: votes?.map(({ userId }) => userId) ?? [],
        userValue: votes?.find((val) => val.userId === input.userId)?.value,
        upCount: votes?.filter(({ value }) => value === "up").length ?? 0,
        downCount: votes?.filter(({ value }) => value === "down").length ?? 0,
      },
    };
  },
  getAll: async () => {
    return db.query.features
      .findMany({
        columns: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdBy: true,
        },
        with: {
          votes: {
            columns: { value: true, userId: true },
          },
          comments: true,
        },
      })
      .then((rows) => {
        const formattedArr = rows.map((row) => {
          const { votes, comments, ...feature } = row;

          return {
            ...feature,
            commentCount: comments.length,
            votes: {
              upCount: votes.filter(({ value }) => value === "up").length,
              downCount: votes.filter(({ value }) => value === "down").length,
            },
          };
        });

        return groupBy(formattedArr, (row) => row.status);
      });
  },
};
