import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { categoriesApi } from "@/api/categories";
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/features/categories/types/category";
import type { ApiError } from "@/types/types";

import { adminCategoryKeys } from "../queries/admin-categories.queries";

type UpdateVariables = { categoryId: string; body: UpdateCategoryRequest };
type UploadImageVariables = { categoryId: string; image: File };

const refreshTree = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: adminCategoryKeys.tree() });

export const adminCategoryMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions<CategoryResponse, AxiosError<ApiError>, CreateCategoryRequest>({
      mutationFn: async (body) => (await categoriesApi.create(body)).data,
      onSuccess: () => refreshTree(queryClient),
    }),

  update: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, UpdateVariables>({
      mutationFn: async ({ categoryId, body }) => {
        await categoriesApi.update(categoryId, body);
      },
      onSuccess: () => refreshTree(queryClient),
    }),

  uploadImage: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, UploadImageVariables>({
      mutationFn: async ({ categoryId, image }) => {
        await categoriesApi.uploadImage(categoryId, image);
      },
      onSuccess: () => refreshTree(queryClient),
    }),

  removeImage: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, string>({
      mutationFn: async (categoryId) => {
        await categoriesApi.removeImage(categoryId);
      },
      onSuccess: () => refreshTree(queryClient),
    }),
};
