import type { ReactNode } from "react";

type AuthContentContainerProps = {
  children: ReactNode;
};

export function AuthContentContainer({ children }: AuthContentContainerProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 sm:px-0">
      <div className="w-full max-w-120 space-y-6">{children}</div>
    </div>
  );
}
