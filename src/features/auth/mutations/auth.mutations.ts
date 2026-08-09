import { authApi } from "@/api/auth";
import { mutationOptions, type QueryClient } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";
import type { LoginCredentials } from "../types/auth";

export const authMutations = {
  login: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials);
        return response.data;
      },
      onSuccess: async (tokens) => {
        localStorage.setItem("access-token", tokens["access-token"]);
        localStorage.setItem("refresh-token", tokens["refresh-token"]);

        await queryClient.fetchQuery(authQueries.me());
      },
    }),
  signUp: () =>
    mutationOptions({
      mutationFn: async (credentials: LoginCredentials) => {
        await authApi.signUp(credentials);
      },
    }),
};
