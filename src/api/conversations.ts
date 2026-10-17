import client from "@/axios/axios";
import type {
  Conversation,
  ConversationCreatedResponse,
  ConversationsResponse,
  CreateConversationRequest,
  MessagePage,
  SendMessageRequest,
} from "@/features/chats/types/chat";
import { apiEndpoints } from "./endpoints";

export const conversationsApi = {
  list: async () =>
    client.get<ConversationsResponse>(apiEndpoints.conversations.list),
  get: async (id: string) =>
    client.get<Conversation>(apiEndpoints.conversations.item(id)),
  create: async (request: CreateConversationRequest) =>
    client.post<ConversationCreatedResponse>(
      apiEndpoints.conversations.list,
      request,
    ),
  remove: async (id: string) =>
    client.delete<void>(apiEndpoints.conversations.item(id)),
  messages: async (id: string, page = 0, size = 100) =>
    client.get<MessagePage>(apiEndpoints.conversations.messages(id), {
      params: { page, size, sort: "createdAt,ASC" },
    }),
  sendMessage: async (id: string, request: SendMessageRequest) =>
    client.post<void>(apiEndpoints.conversations.messages(id), request),
};
