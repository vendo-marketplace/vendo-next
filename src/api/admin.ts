import client from "@/axios/axios";

import { apiEndpoints } from "./endpoints";

// A full reindex takes far longer than the client's default 15s timeout.
const REINDEX_TIMEOUT_MS = 5 * 60_000;

export const adminApi = {
  reindex: () =>
    client.post<void>(apiEndpoints.admin.indexer.reindex, undefined, {
      timeout: REINDEX_TIMEOUT_MS,
    }),
};
