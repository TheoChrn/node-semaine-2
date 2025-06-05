import { z } from "zod";

export const createVoteSchema = z.object({
  value: z.enum(["up", "down"]),
  featureId: z.string().uuid(),
});
