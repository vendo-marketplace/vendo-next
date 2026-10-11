"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRouter } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export default function AuthenticatedOnlyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isOnboarding = pathname.endsWith("/onboarding");
  const hasStoredSession =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("access-token") ||
      localStorage.getItem("refresh-token"),
    );

  const { data: user, isPending, isError } = useMe(hasStoredSession);

  useEffect(() => {
    if (!isOnboarding && (!hasStoredSession || (!isPending && (isError || !user)))) {
      router.replace("/");
    }
  }, [hasStoredSession, isError, isOnboarding, isPending, router, user]);

  if (!isOnboarding && (!hasStoredSession || isPending || !user)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
