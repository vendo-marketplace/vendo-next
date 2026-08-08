import { z } from "zod";

import type { LoginCredentials } from "../types/auth";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Введіть електронну пошту")
    .email("Введіть коректну електронну пошту"),
  password: z.string().min(1, "Введіть пароль"),
}) satisfies z.ZodType<LoginCredentials>;
