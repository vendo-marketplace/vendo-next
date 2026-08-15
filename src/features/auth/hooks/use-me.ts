import { useQuery } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";

const hasStoredSession = () =>
  typeof window !== "undefined" &&
  Boolean(
    localStorage.getItem("access-token") ||
    localStorage.getItem("refresh-token"),
  );

export const useMe = (enabled: boolean = true) =>
  useQuery({ ...authQueries.me(), enabled: enabled && hasStoredSession() });
