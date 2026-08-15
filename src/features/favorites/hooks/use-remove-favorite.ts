import { useMutation, useQueryClient } from "@tanstack/react-query";

import { favoriteMutations } from "../mutations/favorite.mutations";

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation(favoriteMutations.remove(queryClient));
};
