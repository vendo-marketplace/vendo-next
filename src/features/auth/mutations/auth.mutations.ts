import { authApi } from "@/api/auth";
import { mutationOptions, type QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/types/types";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { authQueries } from "../queries/auth.queries";
import type {
  AccountCompletionCredentials,
  ForgotPasswordCredentials,
  GoogleLoginCredentials,
  LoginCredentials,
  ResetPasswordCredentials,
} from "../types/auth";

const createSessionMutation = <TCredentials,>(
  queryClient: QueryClient,
  signIn: (credentials: TCredentials) => Promise<unknown>,
) =>
  mutationOptions<void, AxiosError<ApiError>, TCredentials>({
    mutationFn: async (credentials) => {
      await signIn(credentials);
    },
    onSuccess: async () => {
      await queryClient.fetchQuery({ ...authQueries.me(), staleTime: 0 });
      toast.success("Вхід виконано");
    },
  });

export const authMutations = {
  login: (queryClient: QueryClient) =>
    createSessionMutation<LoginCredentials>(queryClient, authApi.login),
  googleLogin: (queryClient: QueryClient) =>
    createSessionMutation<GoogleLoginCredentials>(
      queryClient,
      authApi.googleLogin,
    ),
  signUp: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, LoginCredentials>({
      mutationFn: async (credentials) => {
        await authApi.signUp(credentials);
      },
      onSuccess: (_data, credentials) => {
        void authApi.sendVerification(credentials.email).catch(() => {
          toast.error("Не вдалося надіслати код автоматично. Ви зможете запросити його на наступному кроці.");
        });
        void queryClient.fetchQuery(authQueries.me()).catch(() => undefined);
      },
    }),
  validateVerification: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, string>({
      mutationFn: async (code) => {
        await authApi.validateVerification(code);
      },
      onSuccess: async () => {
        await queryClient.fetchQuery({
          ...authQueries.me(),
          staleTime: 0,
        });
      },
    }),
  completeAccount: (queryClient: QueryClient) =>
    mutationOptions<void, AxiosError<ApiError>, AccountCompletionCredentials>({
      mutationFn: async (credentials) => {
        await authApi.completeAccount(credentials);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: authQueries.me().queryKey,
        });
      },
    }),
  resendVerification: () =>
    mutationOptions<void, AxiosError<ApiError>, string>({
      mutationFn: async (email) => {
        await authApi.resendVerification(email);
      },
    }),
  startVerification: () =>
    mutationOptions<void, AxiosError<ApiError>, string>({
      mutationFn: async (email) => {
        try {
          await authApi.sendVerification(email);
        } catch {
          await authApi.resendVerification(email);
        }
      },
    }),
  forgotPassword: () =>
    mutationOptions<void, AxiosError<ApiError>, ForgotPasswordCredentials>({
      mutationFn: async (credentials) => {
        await authApi.forgotPassword(credentials);
      },
    }),
  resendPassword: () =>
    mutationOptions<void, AxiosError<ApiError>, ForgotPasswordCredentials>({
      mutationFn: async (credentials) => {
        await authApi.resendPassword(credentials);
      },
    }),
  resetPassword: () =>
    mutationOptions<void, AxiosError<ApiError>, ResetPasswordCredentials>({
      mutationFn: async (credentials) => {
        await authApi.resetPassword(credentials);
      },
    }),
};
