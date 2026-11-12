import { conversationsApi } from "@/api/conversations";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

import type { Conversation, ReadState } from "@/features/chats/types/chat";

export const chatKeys = {
  all: ["conversations"] as const,
  list: () => [...chatKeys.all, "list"] as const,
  unread: () => [...chatKeys.all, "unread"] as const,
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
      refetchOnWindowFocus: true,
    }),
  unread: () =>
    queryOptions({
      queryKey: chatKeys.unread(),
      queryFn: async () => {
        const response = await conversationsApi.unread();
        return response.data.count;
      },
      // Polled until the backend pushes unread changes over a per-user socket topic.
      refetchOnWindowFocus: true,
      refetchInterval: 60_000,
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

export const setConversationReadState = (
  queryClient: QueryClient,
  conversationId: string,
  readerId: string,
  readState: ReadState,
) => {
  const withReadState = (conversation: Conversation): Conversation =>
    conversation.id === conversationId
      ? {
          ...conversation,
          readStates: { ...conversation.readStates, [readerId]: readState },
        }
      : conversation;

  queryClient.setQueryData<Conversation[]>(chatKeys.list(), (conversations) =>
    conversations?.map(withReadState),
  );
  queryClient.setQueryData<Conversation>(
    chatKeys.conversation(conversationId),
    (conversation) => conversation && withReadState(conversation),
  );
};
