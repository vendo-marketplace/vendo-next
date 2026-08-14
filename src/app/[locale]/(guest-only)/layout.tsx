"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";

export default function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasStoredSession =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("access-token") ||
      localStorage.getItem("refresh-token"),
    );

  const { data: user, isLoading } = useMe(hasStoredSession);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
