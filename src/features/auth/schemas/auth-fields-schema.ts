import { z } from "zod";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const authFieldsSchema = {
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
} as const;
