import { authApi } from "@/api/auth";
import { mutationOptions, type QueryClient } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";
import type {
  ForgotPasswordCredentials,
  GoogleLoginCredentials,
  LoginCredentials,
  LoginResponse,
} from "../types/auth";
import { AxiosError } from "axios";
import { ApiError } from "@/types/types";
import { toast } from "sonner";

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
        toast.success("Signed in!");
      },
    }),
  googleLogin: (queryClient: QueryClient) =>
    mutationOptions<LoginResponse, AxiosError<ApiError>, GoogleLoginCredentials>(
      {
        mutationFn: async (credentials: GoogleLoginCredentials) => {
          const response = await authApi.googleLogin(credentials);
          return response.data;
        },
        onSuccess: async (tokens) => {
          localStorage.setItem("access-token", tokens["access-token"]);
          localStorage.setItem("refresh-token", tokens["refresh-token"]);

          await queryClient.fetchQuery(authQueries.me());
          toast.success("Signed in!");
        },
      },
    ),
  signUp: () =>
    mutationOptions<void, Error, LoginCredentials>({
      mutationFn: async (credentials) => {
        void credentials;
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 500);
        });
      },
    }),
  forgotPassword: () =>
    mutationOptions<
      void,
      AxiosError<ApiError>,
      ForgotPasswordCredentials
    >({
      mutationFn: async (credentials) => {
        await authApi.forgotPassword(credentials);
      },
    }),
};
