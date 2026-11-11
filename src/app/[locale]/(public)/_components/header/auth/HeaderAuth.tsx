"use client";

import { useTranslations } from "next-intl";
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
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { ShieldIcon } from "@/assets/icons/ShieldIcon";
import { UserCircleIcon } from "@/assets/icons/UserCircleIcon";
import { UserIcon } from "@/assets/icons/UserIcon";
import { hasAdminRole } from "@/features/admin/utils/has-admin-role";
import { useMe } from "@/features/auth/hooks/use-me";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Link, useRouter } from "@/i18n/navigation";
import ProfileDialog from "./ProfileDialog";

export default function HeaderAuth() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          asChild
          variant="outline"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm font-normal text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary sm:inline-flex"
        >
          <Link href="/sign-in">Вхід</Link>
        </Button>
        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-stroke-secondary sm:block"
        />
        <Button
          asChild
          variant="outline"
          className="hidden h-10 border-0 bg-transparent px-2 text-sm font-normal text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary sm:inline-flex"
        >
          <Link href="/sign-up">Реєстрація</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="size-8 border-0 p-0 sm:hidden"
        >
          <Link href="/sign-in" aria-label="Увійти або зареєструватися">
            <UserCircleIcon size={24} />
          </Link>
        </Button>
      </div>
    );
  }

  const needsProfileAttention =
    !user.emailVerified || !user.fullName?.trim();
  const displayName = user.fullName?.trim() || "Мій акаунт";

  return (
    <>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="outline"
            className="size-8 border-0 p-0"
            aria-label={
              needsProfileAttention
                ? "Відкрити меню акаунта, потрібна дія в профілі"
                : "Відкрити меню акаунта"
            }
          >
            <span className="relative grid size-6 place-items-center">
              <UserCircleIcon size={24} />
              {needsProfileAttention && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface-primary bg-surface-warning"
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
                ? "bg-surface-warning-subtle text-text-warning hover:bg-orange-100 hover:text-orange-800 data-highlighted:bg-orange-100 data-highlighted:text-orange-800"
                : undefined
            }
          >
            <UserIcon
              size={16}
              className={needsProfileAttention ? "text-text-warning" : undefined}
            />
            <span className="flex-1">Детальніше про профіль</span>
            {needsProfileAttention && (
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-surface-warning"
              />
            )}
          </DropdownItem>
          <DropdownItem asChild>
            <Link href="/auto-search">
              <SearchIcon size={16} />
              Мої автопошуки
            </Link>
          </DropdownItem>
          {hasAdminRole(user) && (
            <DropdownItem asChild>
              <Link href="/admin">
                <ShieldIcon size={16} />
                {t("headerLink")}
              </Link>
            </DropdownItem>
          )}
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
