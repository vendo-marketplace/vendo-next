import { apiEndpoints } from "@/api/endpoints";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const UNAUTHORIZED_STATUS = 401;
const REFRESH_COOKIE_NAME = "refresh-token";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let refreshRequest: Promise<void> | null = null;

const refreshExcludedEndpoints = [
  apiEndpoints.auth.login,
  apiEndpoints.auth.signUp,
  apiEndpoints.auth.google,
  apiEndpoints.auth.complete,
  apiEndpoints.auth.forgotPassword,
  apiEndpoints.auth.resendPassword,
  apiEndpoints.auth.resetPassword,
  apiEndpoints.auth.refresh,
  apiEndpoints.verification.send,
  apiEndpoints.verification.resend,
  apiEndpoints.verification.validate,
];

const isAuthEndpoint = (url: string | undefined, endpoint: string): boolean => {
  if (!url) return false;

  const normalizedUrl = url.split(/[?#]/, 1)[0].replace(/^\/+/, "");
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");

  return (
    normalizedUrl === normalizedEndpoint ||
    normalizedUrl.endsWith(`/${normalizedEndpoint}`)
  );
};

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
};

const refreshAccessToken = (): Promise<void> => {
  if (!refreshRequest) {
    const refreshToken = readCookie(REFRESH_COOKIE_NAME);

    if (!refreshToken) {
      return Promise.reject(new Error("Refresh cookie is unavailable"));
    }

    refreshRequest = client
      .post<void>(apiEndpoints.auth.refresh, {
        refreshToken,
      })
      .then(() => undefined)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== UNAUTHORIZED_STATUS ||
      !originalRequest ||
      originalRequest._retry ||
      refreshExcludedEndpoints.some((endpoint) =>
        isAuthEndpoint(originalRequest.url, endpoint),
      ) ||
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
