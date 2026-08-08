import { authApi } from "@/api/auth";
import { queryOptions } from "@tanstack/react-query";

import { authKeys } from "./auth.keys";

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      queryFn: async () => {
        const response = await authApi.me();
        return response.data;
      },
    }),
};
