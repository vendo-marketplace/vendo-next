import { z } from "zod";

import type { AccountCompletionCredentials } from "../types/auth";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidPastDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= today
  );
};

export const accountCompletionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Ім’я обов’язкове")
    .max(100, "Ім’я має містити не більше 100 символів"),
  birthDate: z
    .string()
    .min(1, "Дата народження обов’язкова")
    .refine(isValidPastDate, "Введіть коректну дату народження"),
}) satisfies z.ZodType<AccountCompletionCredentials>;
