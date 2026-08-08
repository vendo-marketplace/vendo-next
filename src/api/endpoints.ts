export const apiEndpoints = {
  auth: {
    login: "/auth/sign-in",
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
