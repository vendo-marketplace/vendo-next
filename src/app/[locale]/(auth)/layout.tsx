"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const { data: user, isPending } = useMe(hasStoredSession);

  useEffect(() => {
    if (!isPending && user) {
      router.replace("/");
    }
  }, [isPending, router, user]);

  if (isPending || user) {
    return <LoadingSpinner />;
  }

  return children;
}
