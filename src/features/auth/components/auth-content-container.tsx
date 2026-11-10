import type { ReactNode } from "react";

type AuthContentContainerProps = {
  children: ReactNode;
};

export function AuthContentContainer({ children }: AuthContentContainerProps) {
  return (
    <div className="flex flex-1 items-start justify-center px-4 pt-6 pb-10 sm:items-center sm:px-0 sm:py-10">
      <div className="w-full max-w-120 space-y-6">{children}</div>
    </div>
  );
}
