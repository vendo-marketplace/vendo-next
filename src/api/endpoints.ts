export const apiEndpoints = {
  auth: {
    login: "/auth/sign-in",
    google: "/auth/google",
    signUp: "/auth/sign-up",
    forgotPassword: "/password/forgot",
    resendPasswordOtp: "/password/resend-otp",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
  categories: {
    tree: "/categories/tree",
  },
  products: {
    search: "/search",
  },
} as const;
