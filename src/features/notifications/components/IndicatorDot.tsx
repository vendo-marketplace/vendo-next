import { cn } from "@/utils/utils";

import type { IndicatorTone } from "../hooks/use-unread-indicators";

const TONE_CLASSNAME: Record<IndicatorTone, string> = {
  error: "bg-surface-error",
  warning: "bg-surface-warning",
};

// The small dot on an icon's top-right corner: red for something new, orange for a warning.
// It is only a visual mark, so the control's own label must say the same in words.
export function IndicatorDot({ tone, className }: { tone: IndicatorTone; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface-primary",
        TONE_CLASSNAME[tone],
        className,
      )}
    />
  );
}
