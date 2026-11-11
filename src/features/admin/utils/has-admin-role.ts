import type { MeResponse } from "@/features/auth/types/auth";

export const hasAdminRole = (user: MeResponse | null | undefined) =>
  user?.roles.includes("ADMIN") ?? false;
