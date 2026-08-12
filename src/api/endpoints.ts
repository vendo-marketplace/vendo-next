export const apiEndpoints = {
  auth: {
    login: "/auth/sign-in",
    google: "/auth/google",
    signUp: "/auth/sign-up",
    forgotPassword: "/password/forgot",
    resendPassword: "/password/resend",
    resetPassword: "/password/reset",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
  verification: {
    send: "/verification/send",
    resend: "/verification/resend",
    validate: "/verification/validate",
  },
  categories: {
    tree: "/categories/tree",
  },
  products: {
    search: "/search",
  },
} as const;
