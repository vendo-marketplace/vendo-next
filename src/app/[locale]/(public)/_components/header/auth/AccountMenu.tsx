"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

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
import { UserIcon } from "@/assets/icons/UserIcon";
import { hasAdminRole } from "@/features/admin/utils/has-admin-role";
import type { MeResponse } from "@/features/auth/types/auth";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Link, useRouter } from "@/i18n/navigation";

import ProfileDialog from "./ProfileDialog";

export const needsProfileAttention = (user: MeResponse) =>
  !user.emailVerified || !user.fullName?.trim();

// The account menu, opened from the header icon on tablets and desktop and from the bottom
// menu on phones, where it opens upwards.
export default function AccountMenu({
  user,
  trigger,
  side = "bottom",
}: {
  user: MeResponse;
  // A single focusable element: the dropdown attaches to it.
  trigger: ReactNode;
  side?: "top" | "bottom";
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const needsAttention = needsProfileAttention(user);
  const displayName = user.fullName?.trim() || "Мій акаунт";

  return (
    <>
      <Dropdown>
        <DropdownTrigger asChild>{trigger}</DropdownTrigger>

        <DropdownContent side={side} align="end" sideOffset={8} className="w-72 p-2">
          <DropdownLabel className="px-3 pb-3 pt-2">
            <span className="block truncate text-sm font-semibold text-text-primary">
              {displayName}
            </span>
            <span className="mt-1 block truncate font-normal">{user.email}</span>
          </DropdownLabel>
          <DropdownItem
            onSelect={() => setIsProfileOpen(true)}
            className={
              needsAttention
                ? "bg-surface-warning-subtle text-text-warning hover:bg-orange-100 hover:text-orange-800 data-highlighted:bg-orange-100 data-highlighted:text-orange-800"
                : undefined
            }
          >
            <UserIcon size={16} className={needsAttention ? "text-text-warning" : undefined} />
            <span className="flex-1">Детальніше про профіль</span>
            {needsAttention && (
              <span aria-hidden="true" className="size-2 rounded-full bg-surface-warning" />
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
      <ProfileDialog user={user} open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
}
