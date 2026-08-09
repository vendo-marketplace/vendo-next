import { apiEndpoints } from "@/api/endpoints";
import client from "@/axios/axios";
import type {
  LoginCredentials,
  LoginResponse,
  MeResponse,
} from "@/features/auth/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials) =>
    client.post<LoginResponse>(apiEndpoints.auth.login, credentials),
  signUp: async (credentials: LoginCredentials) =>
    client.post<void>(apiEndpoints.auth.signUp, credentials),
  forgotPassword: async (email: string) =>
    client.post<void>(apiEndpoints.auth.forgotPassword, null, {
      params: { email },
    }),
  me: async () => client.get<MeResponse>(apiEndpoints.auth.me),
};
