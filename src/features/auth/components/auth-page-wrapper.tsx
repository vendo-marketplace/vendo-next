import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

import { AuthContentFooter } from "./auth-content-footer";

type AuthPageWrapperProps = {
  children: ReactNode;
};

export function AuthPageWrapper({ children }: AuthPageWrapperProps) {
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
