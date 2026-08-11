import type { ReactNode } from "react";

type AuthContentHeaderProps = {
  title: ReactNode;
  description: ReactNode;
};

export function AuthContentHeader({
  title,
  description,
}: AuthContentHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
        {title}
      </h1>
      <p className="text-[16px] leading-6 font-normal text-neutral-400">
        {description}
      </p>
    </div>
  );
}
