"use client";

import { Search, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button/button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown/dropdown";
import { CircleUserIcon } from "@/components/ui/icons";
import { useMe } from "@/features/auth/hooks/use-me";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { hasRequiredProfileDetails } from "@/features/auth/utils/profile";
import { Link, useRouter } from "@/i18n/navigation";
import ProfileDialog from "./ProfileDialog";

export default function HeaderAuth() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          asChild
          variant="secondary"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary sm:inline-flex"
        >
          <Link href="/sign-in">Вхід</Link>
        </Button>
        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-stroke-secondary sm:block"
        />
        <Button
          asChild
          variant="secondary"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary sm:inline-flex"
        >
          <Link href="/sign-up">Реєстрація</Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          className="size-8 border-0 p-0 sm:hidden"
        >
          <Link href="/sign-in" aria-label="Увійти або зареєструватися">
            <CircleUserIcon className="size-6" />
          </Link>
        </Button>
      </div>
    );
  }

  const needsProfileAttention = !hasRequiredProfileDetails(user);
  const displayName = user.fullName?.trim() || "Мій акаунт";

  return (
    <>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="secondary"
            className="size-8 border-0 p-0"
            aria-label={
              needsProfileAttention
                ? "Відкрити меню акаунта, потрібна дія в профілі"
                : "Відкрити меню акаунта"
            }
          >
            <span className="relative grid size-6 place-items-center">
              <CircleUserIcon className="size-6" />
              {needsProfileAttention && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface-primary bg-amber-500"
                />
              )}
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownContent align="end" sideOffset={8} className="w-72 p-2">
          <DropdownLabel className="px-3 pb-3 pt-2">
            <span className="block truncate text-sm font-semibold text-text-primary">
              {displayName}
            </span>
            <span className="mt-1 block truncate font-normal">{user.email}</span>
          </DropdownLabel>
          <DropdownItem
            onSelect={() => setIsProfileOpen(true)}
            className={
              needsProfileAttention
                ? "bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900 data-highlighted:bg-amber-100 data-highlighted:text-amber-900"
                : undefined
            }
          >
            <UserRound
              aria-hidden="true"
              className={`size-4 ${needsProfileAttention ? "text-amber-700" : ""}`}
            />
            <span className="flex-1">Детальніше про профіль</span>
            {needsProfileAttention && (
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-amber-500"
              />
            )}
          </DropdownItem>
          <DropdownItem asChild>
            <Link href="/auto-search">
              <Search aria-hidden="true" className="size-4" />
              Мої автопошуки
            </Link>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            disabled={isLoggingOut}
            onSelect={() => logout(undefined, { onSuccess: () => router.refresh() })}
          >
            {isLoggingOut ? "Вихід…" : "Вийти"}
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
      <ProfileDialog
        user={user}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </>
  );
}
