import { z } from "zod";

const email = z.string().trim().toLowerCase().max(254).pipe(z.email());

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;