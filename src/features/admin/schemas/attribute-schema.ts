import { z } from "zod";

import type { CategoryAttributeType } from "@/features/categories/types/category";

// The API's CreateAttributeRequest title pattern: capitalised first word, then
// words joined by a space, a hyphen or ", ".
const TITLE_PATTERN =
  /^[A-ZА-ЯІЇЄ][a-zа-яіїє]*(?:[ -][A-Za-zА-ЯІЇЄа-яіїє-]+|, [A-Za-zА-ЯІЇЄа-яіїє]+)*$/;
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
      .regex(
        TITLE_PATTERN,
        "З великої літери, далі малі; слова через пробіл, дефіс або «, ».",
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
