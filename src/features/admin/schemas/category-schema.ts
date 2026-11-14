import { z } from "zod";

// Same patterns as the API's CreateCategoryRequest.
const TITLE_PATTERN =
  /^[A-ZА-ЯІЇЄ][A-Za-zА-ЯІЇЄа-яіїє]*(?:[ -][A-Za-zА-ЯІЇЄа-яіїє]+)*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

export const categoryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Вкажіть назву.")
    .regex(
      TITLE_PATTERN,
      "З великої літери; лише літери, пробіли й дефіси між словами.",
    ),
  slug: z
    .string()
    .trim()
    .min(1, "Вкажіть slug.")
    .regex(SLUG_PATTERN, "Лише a–z, 0–9 і «_» між ними, напр. phones_and_gadgets."),
  attributes: z.array(z.string().min(1)),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
