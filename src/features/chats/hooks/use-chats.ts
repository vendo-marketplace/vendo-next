import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { conversationsApi } from "@/api/conversations";
import { chatKeys, chatQueries } from "@/features/chats/queries/chat.queries";
import type {
  CreateConversationRequest,
  SendMessageRequest,
} from "@/features/chats/types/chat";

export function useConversations(enabled = true) {
  return useQuery({ ...chatQueries.list(), enabled });
}

export function useConversation(id: string) {
  return useQuery(chatQueries.conversation(id));
}

export function useConversationMessages(id: string) {
  return useQuery(chatQueries.messages(id));
}

export function useChatMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (request: CreateConversationRequest) =>
      conversationsApi.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: chatKeys.list() }),
  });

  const send = useMutation({
    mutationFn: ({ id, request }: { id: string; request: SendMessageRequest }) =>
      conversationsApi.sendMessage(id, request),
    onSuccess: (_response, { id }) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(id) });
      void queryClient.invalidateQueries({ queryKey: chatKeys.conversation(id) });
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => conversationsApi.remove(id),
    onSuccess: (_response, id) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      queryClient.removeQueries({ queryKey: chatKeys.conversation(id) });
      queryClient.removeQueries({ queryKey: chatKeys.messages(id) });
    },
  });

  return { create, send, remove };
}
