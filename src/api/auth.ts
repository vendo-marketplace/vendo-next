import { apiEndpoints } from "@/api/endpoints";
import client from "@/axios/axios";
import type {
  AccountCompletionCredentials,
  ForgotPasswordCredentials,
  GoogleLoginCredentials,
  LoginCredentials,
  LoginResponse,
  MeResponse,
  ResetPasswordCredentials,
} from "@/features/auth/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.login, credentials),
  googleLogin: async (credentials: GoogleLoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.google, credentials),
  signUp: async (credentials: LoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.signUp, credentials),
  completeAccount: async (credentials: AccountCompletionCredentials) =>
    client.patch<void>(apiEndpoints.auth.complete, credentials),
  sendVerification: async (email: string) =>
    client.post<void>(apiEndpoints.verification.send, undefined, {
      params: { email },
      validateStatus: (status) => status === 200,
    }),
  resendVerification: async (email: string) =>
    client.post<void>(apiEndpoints.verification.resend, undefined, {
      params: { email },
    }),
  validateVerification: async (code: string) =>
    client.post<void>(apiEndpoints.verification.validate, undefined, {
      params: { code },
    }),
  forgotPassword: async (credentials: ForgotPasswordCredentials) =>
    client.post<void>(apiEndpoints.auth.forgotPassword, undefined, {
      params: credentials,
    }),
  resendPassword: async (credentials: ForgotPasswordCredentials) =>
    client.put<void>(apiEndpoints.auth.resendPassword, undefined, {
      params: credentials,
    }),
  resetPassword: async ({ code, password }: ResetPasswordCredentials) =>
    client.put<void>(
      apiEndpoints.auth.resetPassword,
      { password },
      { params: { code } },
    ),
  me: async () => client.get<MeResponse>(apiEndpoints.auth.me),
};
