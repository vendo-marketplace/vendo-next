import { useQuery } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";

export const useMe = (enabled: boolean = true) =>
  useQuery({ ...authQueries.me(), enabled });
