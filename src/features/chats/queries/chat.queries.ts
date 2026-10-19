import { conversationsApi } from "@/api/conversations";
import { queryOptions } from "@tanstack/react-query";

export const chatKeys = {
  all: ["conversations"] as const,
  list: () => [...chatKeys.all, "list"] as const,
  conversation: (id: string) => [...chatKeys.all, "item", id] as const,
  messages: (id: string) => [...chatKeys.all, "messages", id] as const,
};

export const chatQueries = {
  list: () =>
    queryOptions({
      queryKey: chatKeys.list(),
      queryFn: async () => {
        const response = await conversationsApi.list();
        return response.data.data;
      },
      refetchInterval: 15_000,
    }),
  conversation: (id: string) =>
    queryOptions({
      queryKey: chatKeys.conversation(id),
      queryFn: async () => {
        const response = await conversationsApi.get(id);
        return response.data;
      },
      enabled: Boolean(id),
    }),
};
