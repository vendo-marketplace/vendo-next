import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminCategoryMutations } from "../mutations/admin-categories.mutations";
import { adminCategoryQueries } from "../queries/admin-categories.queries";

export const useAdminCategoryTree = () => useQuery(adminCategoryQueries.tree());

export const useCreateCategory = () =>
  useMutation(adminCategoryMutations.create(useQueryClient()));

export const useUpdateCategory = () =>
  useMutation(adminCategoryMutations.update(useQueryClient()));

export const useUploadCategoryImage = () =>
  useMutation(adminCategoryMutations.uploadImage(useQueryClient()));

export const useRemoveCategoryImage = () =>
  useMutation(adminCategoryMutations.removeImage(useQueryClient()));
