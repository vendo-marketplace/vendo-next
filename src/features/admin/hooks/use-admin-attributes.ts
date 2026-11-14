import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AttributeFilters } from "@/features/categories/types/category";

import { adminAttributeMutations } from "../mutations/admin-attributes.mutations";
import { adminAttributeQueries } from "../queries/admin-attributes.queries";

export const useAdminAttributes = (filters?: AttributeFilters) =>
  useQuery(adminAttributeQueries.list(filters));

export const useCreateAttribute = () =>
  useMutation(adminAttributeMutations.create(useQueryClient()));

export const useUpdateAttribute = () =>
  useMutation(adminAttributeMutations.update(useQueryClient()));
