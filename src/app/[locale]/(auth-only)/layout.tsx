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
  const { data: user, isPending, isError } = useMe();

  useEffect(() => {
    if (!isOnboarding && !isPending && (isError || !user)) {
      router.replace("/");
    }
  }, [isError, isOnboarding, isPending, router, user]);

  if (!isOnboarding && (isPending || !user)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
