import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

import { AuthContentFooter } from "./auth-content-footer";

type AuthPageWrapperProps = {
  children: ReactNode;
  showHeaderLogo?: boolean;
};

export function AuthPageWrapper({
  children,
  showHeaderLogo = true,
}: AuthPageWrapperProps) {
  return (
    <>
      {showHeaderLogo && (
        <div className="flex border-b border-stroke-secondary px-4 py-6 sm:px-15">
          <Logo size="sm" />
        </div>
      )}
      {children}
      <AuthContentFooter />
    </>
  );
}
