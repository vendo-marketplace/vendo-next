import type { MeResponse } from "@/features/auth/types/auth";
import { needsProfileAttention } from "@/features/auth/utils/needs-profile-attention";
import { useUnreadConversationsCount } from "@/features/chats/hooks/use-chats";

export type IndicatorTone = "error" | "warning";

// What the red and orange dots in the header and the bottom menu show.
// TODO(api): notifications are a stub until they get their own endpoint.
export const useUnreadIndicators = (user: MeResponse | null | undefined) => {
  const { data: unreadChats = 0 } = useUnreadConversationsCount(Boolean(user));
  const hasUnreadChats = Boolean(user) && unreadChats > 0;
  const unreadNotifications = 0;

  // Red (something new) wins over orange (finish the profile) on the account icon;
  // the orange mark stays on the profile item inside the menu.
  const accountTone: IndicatorTone | null = !user
    ? null
    : unreadNotifications > 0
      ? "error"
      : needsProfileAttention(user)
        ? "warning"
        : null;

  return { hasUnreadChats, unreadNotifications, accountTone };
};

// Screen readers hear what the dot means, since the dot itself is hidden from them.
export const getAccountMenuLabel = (tone: IndicatorTone | null) => {
  if (tone === "error") return "Відкрити меню акаунта, є нові сповіщення";
  if (tone === "warning") return "Відкрити меню акаунта, потрібна дія в профілі";
  return "Відкрити меню акаунта";
};

export const getChatsLabel = (hasUnread: boolean, label: string) =>
  hasUnread ? `${label}, є нові повідомлення` : label;
