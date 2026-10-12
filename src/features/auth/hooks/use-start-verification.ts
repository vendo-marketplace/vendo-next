import { useMutation } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useStartVerification = () =>
  useMutation(authMutations.startVerification());
