import client from "@/axios/axios";
import type { CategoryAttribute } from "@/features/categories/types/category";

import { apiEndpoints } from "./endpoints";

export const categoriesApi = {
  attributes: async (categoryId: string) =>
    client.get<CategoryAttribute[]>(apiEndpoints.categories.attributes(categoryId)),
};
