import client from "@/axios/axios";
import type {
  CategoriesResponse,
  CategoryAttribute,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/features/categories/types/category";

import { apiEndpoints } from "./endpoints";

export const categoriesApi = {
  tree: () => client.get<CategoriesResponse>(apiEndpoints.categories.tree),

  attributes: async (categoryId: string) =>
    client.get<CategoryAttribute[]>(apiEndpoints.categories.attributes(categoryId)),

  create: (body: CreateCategoryRequest) =>
    client.post<CategoryResponse>(apiEndpoints.categories.root, body),

  update: (categoryId: string, body: UpdateCategoryRequest) =>
    client.put<void>(apiEndpoints.categories.root, body, {
      params: { id: categoryId },
    }),

  uploadImage: (categoryId: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    return client.post<void>(apiEndpoints.categories.image, formData, {
      params: { id: categoryId },
    });
  },

  removeImage: (categoryId: string) =>
    client.delete<void>(apiEndpoints.categories.image, {
      params: { id: categoryId },
    }),
};
