import { z } from "zod";

import type { AccountCompletionCredentials } from "../types/auth";

export const accountCompletionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Ім’я обов’язкове")
    .max(100, "Ім’я має містити не більше 100 символів"),
}) satisfies z.ZodType<AccountCompletionCredentials>;
