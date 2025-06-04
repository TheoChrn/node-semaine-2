import { z } from "zod";

export const createFeatureSchema = z.object({
  title: z.string().min(1, "A title is required"),
  description: z.string().min(1, "A description is required"),
});
export const createFeatureInputSchema = createFeatureSchema.extend({
  createdBy: z.string().uuid(),
});
export const updateFeatureSchema = createFeatureSchema.extend({
  id: z.string().uuid(),
});

export const validateIdSchema = z.string().uuid();
