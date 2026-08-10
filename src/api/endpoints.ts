export const apiEndpoints = {
  auth: {
    login: "/auth/sign-in",
    signUp: "/auth/sign-up",
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
