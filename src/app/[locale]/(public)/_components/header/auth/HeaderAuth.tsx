"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Search, ShieldCheck, UserRound } from "lucide-react";
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
import { authKeys } from "@/features/auth/queries/auth.keys";
import { Link, useRouter } from "@/i18n/navigation";
import ProfileDialog from "./ProfileDialog";

export default function HeaderAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasStoredSession, setHasStoredSession] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(
        localStorage.getItem("access-token") ||
        localStorage.getItem("refresh-token"),
      ),
  );

  const { data: user } = useMe(hasStoredSession);

  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    setHasStoredSession(false);
    queryClient.removeQueries({ queryKey: authKeys.all });
    router.refresh();
  };

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

  return (
    <>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="secondary"
            className="size-8 border-0 p-0"
            aria-label="Відкрити меню акаунта"
          >
            <CircleUserIcon className="size-6" />
          </Button>
        </DropdownTrigger>

        <DropdownContent align="end" sideOffset={8} className="w-72 p-2">
          <DropdownLabel className="px-3 pb-3 pt-2">
            <span className="block truncate text-sm font-semibold text-text-primary">
              {user.fullName || "Мій акаунт"}
            </span>
            <span className="mt-1 block truncate font-normal">{user.email}</span>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                user.emailVerified
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.emailVerified ? (
                <BadgeCheck aria-hidden="true" className="size-3.5" />
              ) : (
                <ShieldCheck aria-hidden="true" className="size-3.5" />
              )}
              {user.emailVerified ? "Email підтверджено" : "Підтвердити email"}
            </span>
          </DropdownLabel>
          {!user.emailVerified && (
            <DropdownItem asChild>
              <Link
                href="/onboarding"
                onClick={() =>
                  window.sessionStorage.setItem(
                    "send-verification-code-on-onboarding",
                    "true",
                  )
                }
              >
                <ShieldCheck aria-hidden="true" className="size-4" />
                Підтвердити email
              </Link>
            </DropdownItem>
          )}
          <DropdownItem onSelect={() => setIsProfileOpen(true)}>
            <UserRound aria-hidden="true" className="size-4" />
            Детальніше про профіль
          </DropdownItem>
          <DropdownItem asChild>
            <Link href="/auto-search">
              <Search aria-hidden="true" className="size-4" />
              Мої автопошуки
            </Link>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={logout}>Вийти</DropdownItem>
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
