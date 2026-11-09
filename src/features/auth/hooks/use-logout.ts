import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation(authMutations.logout(queryClient));
}
