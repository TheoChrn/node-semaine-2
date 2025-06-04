import { z } from "zod";

export const createUserSchema = z.object({
  userName: z.string().min(1, "A username is required"),
  password: z.string().min(1, "A password is required"),
  email: z.string().email("An email is required"),
});

export const loginUserSchema = createUserSchema.omit({
  userName: true,
  password: true,
});

export const updateUserSchema = createUserSchema.extend({
  id: z.string(),
});
