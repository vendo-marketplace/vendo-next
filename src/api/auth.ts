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
  me: async () => client.get<MeResponse>(apiEndpoints.auth.me),
};
