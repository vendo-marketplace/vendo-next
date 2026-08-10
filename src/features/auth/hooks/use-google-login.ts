import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation(authMutations.googleLogin(queryClient));
};
