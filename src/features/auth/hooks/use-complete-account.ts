import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useCompleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(authMutations.completeAccount(queryClient));
};
