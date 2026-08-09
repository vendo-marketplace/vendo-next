import { useMutation } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useVerifyEmail = () =>
  useMutation(authMutations.validateVerification());
