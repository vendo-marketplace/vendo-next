import { authApi } from "@/api/auth";
import { mutationOptions, type QueryClient } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";
import type { LoginCredentials, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";
import { ApiError } from "@/types/types";

export const authMutations = {
  login: (queryClient: QueryClient) =>
    mutationOptions<LoginResponse, AxiosError<ApiError>, LoginCredentials>({
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
