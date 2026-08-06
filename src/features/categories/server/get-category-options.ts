"use server";

import { apiEndpoints } from "@/api/endpoints";
import { getApiUrl } from "@/api/get-api-url";
import { ServerActionResult } from "@/types/types";
import type {
  CategoriesResponse,
  Category,
  CategoryOption,
} from "../types/category";

const toCategoryOption = (category: Category): CategoryOption => {
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    children: category.children.map(toCategoryOption),
  };
};

export const getCategoryOptions = async (): Promise<
  ServerActionResult<CategoryOption[]>
> => {
  try {
    const endpoint = getApiUrl(apiEndpoints.categories.tree);

    const response = await fetch(endpoint, {
      next: {
        revalidate: false,
        tags: ["categories"],
      },
    });
    if (!response.ok)
      return { success: false, errorMessage: "Failed to get categories" };
    const result = (await response.json()) as CategoriesResponse;
    return { success: true, data: result.data.map(toCategoryOption) };
  } catch {
    return { success: false, errorMessage: "Failed to get categories" };
  }
};
