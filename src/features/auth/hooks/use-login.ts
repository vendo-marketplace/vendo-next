import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation(authMutations.login(queryClient));
};
