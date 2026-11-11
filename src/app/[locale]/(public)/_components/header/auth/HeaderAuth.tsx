"use client";

import { Button } from "@/components/ui/button/button";
import { NavChatIcon, NavUserIcon } from "@/assets/icons/NavIcons";
import { useMe } from "@/features/auth/hooks/use-me";
import { Link } from "@/i18n/navigation";

import AccountMenu, { needsProfileAttention } from "./AccountMenu";

export default function HeaderAuth() {
  const { data: user } = useMe();

  if (!user) {
    return (
      // Phones sign in from the bottom menu; tablets get an icon, desktop the two text links.
      <div className="hidden items-center gap-1 md:flex lg:gap-2">
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
        <Button
          asChild
          variant="outline"
          className="size-10 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand lg:hidden"
        >
          <Link href="/sign-in" aria-label="Увійти або зареєструватися">
            <NavUserIcon size={24} />
          </Link>
        </Button>
      </div>
    );
  }

  const needsAttention = needsProfileAttention(user);

  return (
    <>
      {/* Phones reach chats and the account menu from the bottom menu. */}
      <Button
        asChild
        variant="outline"
        aria-label="Повідомлення"
        className="hidden size-10 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand md:inline-flex"
      >
        <Link href="/chats">
          <NavChatIcon size={24} />
        </Link>
      </Button>
      <AccountMenu
        user={user}
        trigger={
          <Button
            variant="outline"
            className="hidden size-10 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand md:inline-flex"
            aria-label={
              needsAttention
                ? "Відкрити меню акаунта, потрібна дія в профілі"
                : "Відкрити меню акаунта"
            }
          >
            <span className="relative grid size-6 place-items-center">
              <NavUserIcon size={24} />
              {needsAttention && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface-primary bg-surface-warning"
                />
              )}
            </span>
          </Button>
        }
      />
    </>
  );
}
