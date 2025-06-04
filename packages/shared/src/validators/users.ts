import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("An email is required"),
  password: z.string().min(1, "A password is required"),
});

export const loginUserSchema = createUserSchema.omit({
  password: true,
});

export const updateUserSchema = createUserSchema.extend({
  id: z.string(),
});
