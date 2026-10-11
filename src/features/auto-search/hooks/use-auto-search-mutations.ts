import { autoSearchApi } from "@/api/auto-search";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { autoSearchKeys } from "../queries/auto-search.queries";
import type {
  AutoSearchFilters,
  UpdateAutoSearchRequest,
} from "../types/auto-search";

export const useAutoSearchMutations = () => {
  const queryClient = useQueryClient();
  const refreshList = () =>
    queryClient.invalidateQueries({ queryKey: autoSearchKeys.list() });

  const create = useMutation({
    mutationFn: (filters: AutoSearchFilters) => autoSearchApi.create(filters),
    onSuccess: refreshList,
  });
  const update = useMutation({
    mutationFn: ({ id, filters }: { id: string; filters: UpdateAutoSearchRequest }) =>
      autoSearchApi.update(id, filters),
    onSuccess: (_response, { id }) => {
      void refreshList();
      void queryClient.invalidateQueries({
        queryKey: autoSearchKeys.products(id),
      });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => autoSearchApi.remove(id),
    onSuccess: (_response, id) => {
      void refreshList();
      queryClient.removeQueries({ queryKey: autoSearchKeys.products(id) });
    },
  });

  return { create, update, remove };
};
