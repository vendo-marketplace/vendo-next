import type { Conversation } from "@/features/chats/types/chat";

export const hasUnreadMessages = (conversation: Conversation, userId: string) => {
  const { lastMessage } = conversation;
  if (!lastMessage || lastMessage.senderId === userId) return false;

  return conversation.readStates[userId]?.lastReadMessageId !== lastMessage.id;
};

export const getLastActivityAt = (conversation: Conversation) =>
  conversation.lastMessage?.createdAt ?? conversation.createdAt;
