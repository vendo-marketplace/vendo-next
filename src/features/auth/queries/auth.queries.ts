import { authApi } from "@/api/auth";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import { authKeys } from "./auth.keys";

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      staleTime: 0,
      queryFn: async () => {
        try {
          const response = await authApi.me();
          return response.data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }

          throw error;
        }
      },
    }),
};
