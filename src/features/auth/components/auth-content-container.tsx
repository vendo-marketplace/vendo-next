import type { ReactNode } from "react";

type AuthContentContainerProps = {
  children: ReactNode;
};

export function AuthContentContainer({ children }: AuthContentContainerProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-120 space-y-6">{children}</div>
    </div>
  );
}
