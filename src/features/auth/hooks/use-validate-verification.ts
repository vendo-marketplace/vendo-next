import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useValidateVerification = () => {
  const queryClient = useQueryClient();

  return useMutation(authMutations.validateVerification(queryClient));
};
