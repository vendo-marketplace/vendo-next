import { z } from "zod";

import type { LoginCredentials } from "../types/auth";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Електронна пошта обов'язкова")
    .regex(EMAIL_REGEX, "Невірний формат електронної пошти"),
  password: z
    .string()
    .min(1, "Пароль обов'язковий")
    .regex(
      PASSWORD_REGEX,
      "Пароль повинен містити мінімум 8 символів, включаючи велику та малу літери, цифру та спеціальний символ",
    ),
}) satisfies z.ZodType<LoginCredentials>;
