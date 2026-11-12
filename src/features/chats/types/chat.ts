export interface ConversationParticipant {
  id: string;
  fullName: string;
}

export interface ReadState {
  lastReadMessageId: string;
  lastReadAt: string;
}

export interface LastMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  productId: string;
  seller: ConversationParticipant;
  buyer: ConversationParticipant;
  readStates: Record<string, ReadState>;
  lastMessage: LastMessage | null;
  createdAt: string;
}

export interface UnreadResponse {
  count: number;
}

export interface ConversationsResponse {
  data: Conversation[];
}

export interface CreateConversationRequest {
  firstMessage: string;
  productId: string;
}

export interface ConversationCreatedResponse {
  conversationId: string;
  created: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessagePage {
  content: Message[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface MarkReadRequest {
  lastReadMessageId: string;
}

export interface MessagesReadEvent {
  type: "MESSAGES_READ";
  conversationId: string;
  readerId: string;
  lastReadMessageId: string;
  readAt: string;
}

export interface SendMessageRequest {
  message: string;
}
