import { mutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { adminApi } from "@/api/admin";
import type { ApiError } from "@/types/types";

import { adminKeys } from "../queries/admin.keys";

export const adminMutations = {
  reindex: () =>
    mutationOptions<void, AxiosError<ApiError>, void>({
      mutationKey: adminKeys.reindex(),
      mutationFn: async () => {
        await adminApi.reindex();
      },
    }),
};
