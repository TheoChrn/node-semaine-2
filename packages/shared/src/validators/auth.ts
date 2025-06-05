import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("An email is required"),
  password: z.string().min(1, "A password is required"),
});
