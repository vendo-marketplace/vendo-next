import { z } from "zod";

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(1, "Код підтвердження обов'язковий")
    .regex(/^\d{6}$/, "Введіть шестизначний код"),
});

export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
