"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";

export default function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useMe();

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
