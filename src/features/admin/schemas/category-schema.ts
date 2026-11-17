import { z } from "zod";

import { normalizeApostrophes, TITLE_PATTERN } from "./title-pattern";

const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

export const categoryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Вкажіть назву.")
    .overwrite(normalizeApostrophes)
    .regex(
      TITLE_PATTERN,
      "З великої літери; літери, цифри, апостроф, «-», «/» і «,», слова через один пробіл.",
    ),
  slug: z
    .string()
    .trim()
    .min(1, "Вкажіть slug.")
    .regex(SLUG_PATTERN, "Лише a–z, 0–9 і «_» між ними, напр. phones_and_gadgets."),
  attributes: z.array(z.string().min(1)),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
