"use client";

import { useQueryClient } from "@tanstack/react-query";
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

export default function HeaderAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
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
      <Button asChild variant="secondary" className="size-8 border-0 p-0">
        <Link href="/sign-in" aria-label="Sign in">
          <CircleUserIcon className="size-6" />
        </Link>
      </Button>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="secondary"
          className="size-8 border-0 p-0"
          aria-label="Open account menu"
        >
          <CircleUserIcon className="size-6" />
        </Button>
      </DropdownTrigger>

      <DropdownContent align="end" sideOffset={8}>
        <DropdownLabel className="max-w-64 truncate">
          {user.email}
        </DropdownLabel>
        <DropdownSeparator />
        <DropdownItem onSelect={logout}>Logout</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
