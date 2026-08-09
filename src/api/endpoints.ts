export const apiEndpoints = {
  auth: {
    login: "/auth/sign-in",
    signUp: "/auth/sign-up",
    me: "/auth/me",
    refresh: "/auth/refresh",
    forgotPassword: "/password/forgot",
  },
  categories: {
    tree: "/categories/tree",
  },
  products: {
    search: "/search",
  },
} as const;
