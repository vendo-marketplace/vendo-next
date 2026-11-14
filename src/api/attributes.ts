import client from "@/axios/axios";
import type {
  AttributeFilters,
  CategoryAttribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "@/features/categories/types/category";

import { apiEndpoints } from "./endpoints";

export const attributesApi = {
  list: ({ search, type }: AttributeFilters = {}) =>
    client.get<CategoryAttribute[]>(apiEndpoints.attributes.root, {
      params: { search: search || undefined, type: type || undefined },
    }),

  create: (body: CreateAttributeRequest) =>
    client.post<CategoryAttribute>(apiEndpoints.attributes.root, body),

  update: (attributeId: string, body: UpdateAttributeRequest) =>
    client.put<CategoryAttribute>(apiEndpoints.attributes.item(attributeId), body),
};
