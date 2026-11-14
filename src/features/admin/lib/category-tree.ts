import type { Category, CategoryType } from "@/features/categories/types/category";

export type CategoryTreeStats = {
  total: number;
  byType: Record<CategoryType, number>;
  withoutImage: number;
};

export const walkCategories = function* (
  categories: readonly Category[],
): Generator<Category> {
  for (const category of categories) {
    yield category;
    yield* walkCategories(category.children);
  }
};

export const findCategoryById = (
  categories: readonly Category[],
  categoryId: string,
): Category | undefined => {
  for (const category of walkCategories(categories)) {
    if (category.id === categoryId) return category;
  }
};

// Root-to-category path; empty when the category is not in the tree.
export const findCategoryTrail = (
  categories: readonly Category[],
  categoryId: string,
): Category[] => {
  for (const category of categories) {
    if (category.id === categoryId) return [category];

    const childTrail = findCategoryTrail(category.children, categoryId);
    if (childTrail.length > 0) return [category, ...childTrail];
  }
  return [];
};

export const getCategoryTreeStats = (
  categories: readonly Category[],
): CategoryTreeStats => {
  const stats: CategoryTreeStats = {
    total: 0,
    byType: { PARENT: 0, SUB: 0, CHILD: 0 },
    withoutImage: 0,
  };

  for (const category of walkCategories(categories)) {
    stats.total += 1;
    stats.byType[category.type] += 1;
    if (!category.image) stats.withoutImage += 1;
  }

  return stats;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("uk");

const matchesQuery = (category: Category, query: string) =>
  normalize(category.title).includes(query) ||
  category.slug.includes(query) ||
  category.id === query;

// Keeps matching categories together with their ancestors, so a match deep in
// the tree is still shown in context. A matching category keeps all children.
export const filterCategoryTree = (
  categories: readonly Category[],
  rawQuery: string,
): Category[] => {
  const query = normalize(rawQuery);
  if (!query) return [...categories];

  return categories.flatMap((category) => {
    if (matchesQuery(category, query)) return [category];

    const children = filterCategoryTree(category.children, query);
    return children.length > 0 ? [{ ...category, children }] : [];
  });
};

// Categories that use each attribute, keyed by attribute id.
export const getAttributeUsage = (
  categories: readonly Category[],
): ReadonlyMap<string, Category[]> => {
  const usage = new Map<string, Category[]>();

  for (const category of walkCategories(categories)) {
    for (const { id } of category.attributes) {
      usage.set(id, [...(usage.get(id) ?? []), category]);
    }
  }

  return usage;
};
