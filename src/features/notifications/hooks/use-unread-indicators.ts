import type { MeResponse } from "@/features/auth/types/auth";
import { needsProfileAttention } from "@/features/auth/utils/needs-profile-attention";

export type IndicatorTone = "error" | "warning";

// What the red and orange dots in the header and the bottom menu show.
// TODO(api): both counts are stubs. Chats need an unread count (or the last message id) on
// each conversation, and notifications need their own endpoint; until then no red dot shows.
// Both apply only to a signed-in user.
export const useUnreadIndicators = (user: MeResponse | null | undefined) => {
  const hasUnreadChats = false;
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
