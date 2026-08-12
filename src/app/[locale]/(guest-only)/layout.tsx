"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { Logo } from "@/components/ui/logo";
import AuthContentFooter from "./_components/AuthContentFooter";

export default function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasStoredSession =
    typeof window !== "undefined" &&
    Boolean(
      localStorage.getItem("access-token") ||
      localStorage.getItem("refresh-token"),
    );

  const { data: user, isPending } = useMe(hasStoredSession);

  useEffect(() => {
    if (!isPending && user) {
      router.replace("/");
    }
  }, [isPending, router, user]);

  if (isPending || user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex px-15 py-6">
        <Logo size="sm" />
      </div>
      {children}
      <AuthContentFooter />
    </>
  );
}
