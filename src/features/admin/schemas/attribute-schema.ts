import { z } from "zod";

import type { CategoryAttributeType } from "@/features/categories/types/category";

import { normalizeApostrophes, TITLE_PATTERN } from "./title-pattern";

const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

export const ATTRIBUTE_TYPES = [
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "ENUM",
  "SELECT",
  "RANGE",
] as const satisfies readonly CategoryAttributeType[];

export const typeNeedsValues = (type: CategoryAttributeType) =>
  type === "ENUM" || type === "SELECT";

export const attributeFormSchema = z
  .object({
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
      .regex(SLUG_PATTERN, "Лише a–z, 0–9 і «_» між ними, напр. laptop_memory."),
    type: z.enum(ATTRIBUTE_TYPES),
    required: z.boolean(),
    allowedValues: z.array(z.string().trim().min(1)),
  })
  .superRefine(({ type, allowedValues }, ctx) => {
    if (!typeNeedsValues(type)) return;

    if (allowedValues.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["allowedValues"],
        message: "Для цього типу додайте хоча б одне значення.",
      });
    }
  });

export type AttributeFormValues = z.infer<typeof attributeFormSchema>;
