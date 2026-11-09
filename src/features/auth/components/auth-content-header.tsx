import type { ReactNode } from "react";

type AuthContentHeaderProps = {
  title: ReactNode;
  description: ReactNode;
  className?: string;
};

export function AuthContentHeader({
  title,
  description,
  className,
}: AuthContentHeaderProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <h1 className="text-display-xs font-semibold text-text-primary sm:text-display-sm">
        {title}
      </h1>
      <p className="text-md text-text-secondary">
        {description}
      </p>
    </div>
  );
}
