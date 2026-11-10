import { apiEndpoints } from "@/api/endpoints";
import { getApiUrl } from "@/api/get-api-url";
import type { ServerActionResult } from "@/types/types";
import type {
  CategoriesResponse,
  Category,
  CategoryAttribute,
} from "../types/category";

const findCategory = (
  categories: Category[],
  slug: string,
): Category | undefined => {
  for (const category of categories) {
    if (category.slug === slug) return category;

    const childMatch = findCategory(category.children, slug);
    if (childMatch) return childMatch;
  }
};

const findCategoryInPath = (
  categories: Category[],
  parentSlug: string,
  categorySlug: string,
): Category | undefined => {
  const parent = categories.find((category) => category.slug === parentSlug);
  if (!parent) return undefined;
  if (parent.slug === categorySlug) return parent;
  return findCategory(parent.children, categorySlug);
};

// Root-to-category path, used for breadcrumbs.
const findCategoryTrail = (
  categories: Category[],
  categoryId: string,
): Category[] => {
  for (const category of categories) {
    if (category.id === categoryId) return [category];

    const childTrail = findCategoryTrail(category.children, categoryId);
    if (childTrail.length) return [category, ...childTrail];
  }
  return [];
};

export const getCategoryAttributes = async (
  parentSlug: string,
  categorySlug: string,
): Promise<
  ServerActionResult<{
    category: Category;
    trail: Category[];
    attributes: CategoryAttribute[];
  }>
> => {
  try {
    const categoriesResponse = await fetch(
      getApiUrl(apiEndpoints.categories.tree),
      { cache: "no-store" },
    );

    if (!categoriesResponse.ok) {
      return { success: false, errorMessage: "Failed to get category" };
    }

    const { data } = (await categoriesResponse.json()) as CategoriesResponse;
    const category =
      findCategoryInPath(data, parentSlug, categorySlug) ??
      findCategory(data, categorySlug);

    if (!category) {
      return { success: false, errorMessage: "Category not found" };
    }

    const attributesResponse = await fetch(
      getApiUrl(apiEndpoints.categories.attributes(category.id)),
      { cache: "no-store" },
    );

    if (!attributesResponse.ok) {
      return { success: false, errorMessage: "Failed to get category attributes" };
    }

    const attributes = (await attributesResponse.json()) as CategoryAttribute[];
    return {
      success: true,
      data: { category, trail: findCategoryTrail(data, category.id), attributes },
    };
  } catch {
    return { success: false, errorMessage: "Failed to get category attributes" };
  }
};
