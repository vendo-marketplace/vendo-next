import { apiEndpoints } from "@/api/endpoints";
import type { RefreshResponse } from "@/features/auth/types/auth";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const UNAUTHORIZED_STATUS = 401;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

let refreshRequest: Promise<void> | null = null;

const isAuthEndpoint = (url: string | undefined, endpoint: string): boolean => {
  if (!url) return false;

  const normalizedUrl = url.split(/[?#]/, 1)[0].replace(/^\/+/, "");
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");

  return (
    normalizedUrl === normalizedEndpoint ||
    normalizedUrl.endsWith(`/${normalizedEndpoint}`)
  );
};

const refreshAccessToken = (): Promise<void> => {
  if (!refreshRequest) {
    const refreshToken = localStorage.getItem("refresh-token");

    refreshRequest = client
      .post<RefreshResponse>(apiEndpoints.auth.refresh, {
        refreshToken,
      })
      .then(({ data }) => {
        localStorage.setItem("access-token", data["access-token"]);
        localStorage.setItem("refresh-token", data["refresh-token"]);
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== UNAUTHORIZED_STATUS ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url, apiEndpoints.auth.login) ||
      isAuthEndpoint(originalRequest.url, apiEndpoints.auth.refresh) ||
      typeof window === "undefined"
    ) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return client(originalRequest);
    } catch {
      throw error;
    }
  },
);

export default client;
