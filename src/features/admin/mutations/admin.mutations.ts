import { adminApi } from "@/api/admin";
import type { ApiError } from "@/types/types";
import { mutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const adminKeys = {
  all: ["admin"] as const,
  reindex: () => [...adminKeys.all, "reindex"] as const,
};

export const adminMutations = {
  reindex: () =>
    mutationOptions<void, AxiosError<ApiError>, void>({
      mutationKey: adminKeys.reindex(),
      mutationFn: async () => {
        await adminApi.reindex();
      },
    }),
};
