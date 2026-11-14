import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { attributesApi } from "@/api/attributes";
import type {
  CategoryAttribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "@/features/categories/types/category";
import type { ApiError } from "@/types/types";

import { adminAttributeKeys } from "../queries/admin-attributes.queries";
import { adminCategoryKeys } from "../queries/admin-categories.queries";

type UpdateVariables = { attributeId: string; body: UpdateAttributeRequest };

// The category tree embeds full attributes, so it goes stale with the list.
const refreshAttributes = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: adminAttributeKeys.all }),
    queryClient.invalidateQueries({ queryKey: adminCategoryKeys.tree() }),
  ]);

export const adminAttributeMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions<CategoryAttribute, AxiosError<ApiError>, CreateAttributeRequest>({
      mutationFn: async (body) => (await attributesApi.create(body)).data,
      onSuccess: () => refreshAttributes(queryClient),
    }),

  update: (queryClient: QueryClient) =>
    mutationOptions<CategoryAttribute, AxiosError<ApiError>, UpdateVariables>({
      mutationFn: async ({ attributeId, body }) =>
        (await attributesApi.update(attributeId, body)).data,
      onSuccess: () => refreshAttributes(queryClient),
    }),
};
