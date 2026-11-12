import type { MeResponse } from "@/features/auth/types/auth";

// The profile still needs the user: an unconfirmed email or no name yet.
export const needsProfileAttention = (user: MeResponse) =>
  !user.emailVerified || !user.fullName?.trim();
