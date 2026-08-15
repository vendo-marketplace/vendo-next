import { useMutation, useQueryClient } from "@tanstack/react-query";

import { favoriteMutations } from "../mutations/favorite.mutations";

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation(favoriteMutations.add(queryClient));
};
