export const adminKeys = {
  all: ["admin"] as const,
  reindex: () => [...adminKeys.all, "reindex"] as const,
};
