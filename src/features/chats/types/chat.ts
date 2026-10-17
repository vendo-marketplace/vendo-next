export interface Conversation {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  lastMessage: string;
  createdAt: string;
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

export interface SendMessageRequest {
  message: string;
}
