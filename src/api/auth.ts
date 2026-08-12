import { apiEndpoints } from "@/api/endpoints";
import client from "@/axios/axios";
import type {
  ForgotPasswordCredentials,
  GoogleLoginCredentials,
  LoginCredentials,
  LoginResponse,
  MeResponse,
} from "@/features/auth/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.login, credentials),
  googleLogin: async (credentials: GoogleLoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.google, credentials),
  signUp: async (credentials: LoginCredentials) =>
    client.post<void>(apiEndpoints.auth.signUp, credentials),
  forgotPassword: async (credentials: ForgotPasswordCredentials) =>
    client.post<void>(apiEndpoints.auth.forgotPassword, undefined, {
      params: credentials,
    }),
  resendPassword: async (credentials: ForgotPasswordCredentials) =>
    client.put<void>(apiEndpoints.auth.resendPassword, undefined, {
      params: credentials,
    }),
  me: async () => client.get<MeResponse>(apiEndpoints.auth.me),
};
