"use client";

import { Button } from "@/components/ui/button/button";
import { NavChatIcon, NavUserIcon } from "@/assets/icons/NavIcons";
import { useMe } from "@/features/auth/hooks/use-me";
import { IndicatorDot } from "@/features/notifications/components/IndicatorDot";
import {
  getAccountMenuLabel,
  getChatsLabel,
  useUnreadIndicators,
} from "@/features/notifications/hooks/use-unread-indicators";
import { Link } from "@/i18n/navigation";

import AccountMenu from "./AccountMenu";

export default function HeaderAuth() {
  const { data: user } = useMe();
  const { hasUnreadChats, accountTone } = useUnreadIndicators(user);

  if (!user) {
    return (
      // Phones and tablets sign in from the bottom menu; desktop gets the two text links.
      <div className="hidden items-center gap-2 lg:flex">
        <Button
          asChild
          variant="outline"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm font-normal text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary lg:inline-flex"
        >
          <Link href="/sign-in">Вхід</Link>
        </Button>
        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-stroke-secondary lg:block"
        />
        <Button
          asChild
          variant="outline"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm font-normal text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary lg:inline-flex"
        >
          <Link href="/sign-up">Реєстрація</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Phones and tablets reach chats and the account menu from the bottom menu. */}
      <Button
        asChild
        variant="outline"
        aria-label={getChatsLabel(hasUnreadChats, "Повідомлення")}
        className="relative hidden size-10 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand lg:inline-flex"
      >
        <Link href="/chats">
          <span className="relative grid size-6 place-items-center">
            <NavChatIcon size={24} />
            {hasUnreadChats && <IndicatorDot tone="error" />}
          </span>
        </Link>
      </Button>
      <AccountMenu
        user={user}
        trigger={
          <Button
            variant="outline"
            className="relative hidden size-10 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand lg:inline-flex"
            aria-label={getAccountMenuLabel(accountTone)}
          >
            <span className="relative grid size-6 place-items-center">
              <NavUserIcon size={24} />
              {accountTone && <IndicatorDot tone={accountTone} />}
            </span>
          </Button>
        }
      />
    </>
  );
}
