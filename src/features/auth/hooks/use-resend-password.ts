import { useMutation } from "@tanstack/react-query";

import { authMutations } from "../mutations/auth.mutations";

export const useResendPassword = () =>
  useMutation(authMutations.resendPassword());
