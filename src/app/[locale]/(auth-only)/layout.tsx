"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRouter } from "@/i18n/navigation";
import { type ReactNode, useEffect } from "react";

export default function AuthenticatedOnlyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const hasStoredSession =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("access-token") ||
      localStorage.getItem("refresh-token"),
    );

  const { data: user, isPending, isError } = useMe(hasStoredSession);

  useEffect(() => {
    if (!hasStoredSession || (!isPending && (isError || !user))) {
      router.replace("/");
    }
  }, [hasStoredSession, isError, isPending, router, user]);

  if (!hasStoredSession || isPending || !user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
