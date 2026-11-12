import client from "@/axios/axios";
import type {
  Conversation,
  ConversationCreatedResponse,
  ConversationsResponse,
  CreateConversationRequest,
  MarkReadRequest,
  MessagePage,
  SendMessageRequest,
  UnreadResponse,
} from "@/features/chats/types/chat";
import { apiEndpoints } from "./endpoints";

export const conversationsApi = {
  list: async () =>
    client.get<ConversationsResponse>(apiEndpoints.conversations.list),
  unread: async () => client.get<UnreadResponse>(apiEndpoints.conversations.unread),
  get: async (id: string) =>
    client.get<Conversation>(apiEndpoints.conversations.item(id)),
  create: async (request: CreateConversationRequest) =>
    client.post<ConversationCreatedResponse>(
      apiEndpoints.conversations.list,
      request,
    ),
  remove: async (id: string) =>
    client.delete<void>(apiEndpoints.conversations.item(id)),
  messages: async (id: string, page = 0) =>
    client.get<MessagePage>(apiEndpoints.conversations.messages(id), {
      params: { page },
    }),
  sendMessage: async (id: string, request: SendMessageRequest) =>
    client.post<void>(apiEndpoints.conversations.messages(id), request),
  markRead: async (id: string, request: MarkReadRequest) =>
    client.patch<void>(apiEndpoints.conversations.read(id), request),
};
