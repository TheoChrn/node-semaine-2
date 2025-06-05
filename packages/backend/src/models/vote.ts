import { db } from "@/db/config/pool";

import { schema } from "@/db/schemas";

export const vote = {
  upsert: async (input: CreateVoteInput) => {
    return db
      .insert(schema.votes)
      .values(input)
      .onConflictDoUpdate({
        target: [schema.votes.userId, schema.votes.featureId],
        set: { value: input.value },
      });
  },
};
