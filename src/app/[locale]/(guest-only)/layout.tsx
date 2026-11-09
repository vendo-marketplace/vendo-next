"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRouter } from "@/i18n/navigation";

export default function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useMe();

  useEffect(() => {
    if (user) {
      router.replace(user.emailVerified ? "/" : "/onboarding");
    }
  }, [router, user]);

  if (isPending || user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
