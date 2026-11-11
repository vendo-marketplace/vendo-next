"use client";

import { useId, useState, type ReactNode } from "react";

import { AngleUpIcon } from "@/assets/icons/AngleUpIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { TickIcon } from "@/assets/icons/TickIcon";
import { cn } from "@/utils/utils";

const sectionTitleClassName = "font-sans text-md font-semibold text-text-primary";

export function FilterSection({
  title,
  hint,
  children,
  collapsible = true,
  defaultOpen = true,
  last = false,
}: {
  title: string;
  // Extra control after the title, such as an info popover; kept outside the toggle button.
  hint?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  last?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const chevron = (
    <AngleUpIcon
      size={20}
      className={cn("shrink-0 transition-transform", !isOpen && "rotate-180")}
    />
  );
  const toggleProps = {
    type: "button" as const,
    "aria-expanded": isOpen,
    "aria-controls": contentId,
    onClick: () => setIsOpen((open) => !open),
  };

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4",
        !last && "border-b border-stroke-secondary pb-6",
      )}
    >
      {!collapsible ? (
        <h3 className={sectionTitleClassName}>{title}</h3>
      ) : hint ? (
        <div className="flex items-center gap-1.5">
          <h3 className={sectionTitleClassName}>{title}</h3>
          {hint}
          <button
            {...toggleProps}
            aria-label={`${title}: ${isOpen ? "згорнути" : "розгорнути"}`}
            className="-m-3 ml-auto rounded-sm p-3 text-text-primary lg:m-0 lg:ml-auto lg:p-0"
          >
            {chevron}
          </button>
        </div>
      ) : (
        <h3 className="m-0">
          <button
            {...toggleProps}
            // Touch screens get a 44px row; the negative margin keeps the layout from the mockup.
            className={cn(
              "-my-2.5 flex w-full items-center justify-between gap-2 rounded-sm py-2.5 text-left lg:my-0 lg:py-0",
              sectionTitleClassName,
            )}
          >
            {title}
            {chevron}
          </button>
        </h3>
      )}
      {(!collapsible || isOpen) && (
        <div id={contentId} className="flex flex-col gap-4">
          {children}
        </div>
      )}
    </section>
  );
}

export function FilterChip({
  selected,
  onToggle,
  children,
}: {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "min-h-9 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors lg:min-h-0 lg:px-4 lg:py-2",
        selected
          ? "border-stroke-brand-subtle bg-surface-brand-subtle text-text-brand"
          : "border-stroke-primary-subtle bg-surface-primary text-text-primary hover:bg-surface-secondary",
      )}
    >
      {children}
    </button>
  );
}

export function FilterChips({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function FilterCheckbox({
  checked,
  onChange,
  label,
  count,
  swatch,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
  swatch?: string;
}) {
  return (
    // relative keeps the visually hidden input inside the label, so focusing it never scrolls
    // the filters panel to some other spot.
    <label className="relative flex min-h-9 cursor-pointer items-center gap-2.5 text-sm font-semibold text-text-primary lg:min-h-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm border text-text-invert peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stroke-brand",
          checked
            ? "border-stroke-brand bg-surface-brand"
            : "border-stroke-primary-subtle bg-surface-primary",
        )}
      >
        {checked && <TickIcon size={16} />}
      </span>
      <span className="flex items-center gap-1.5">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full border border-stroke-primary-subtle"
            style={{ backgroundColor: swatch }}
          />
        )}
        <span>
          {label}
          {count !== undefined && (
            <span className="font-normal text-text-secondary"> ({count.toLocaleString("uk-UA")})</span>
          )}
        </span>
      </span>
    </label>
  );
}

export function FilterSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="relative flex min-h-11 cursor-pointer items-center justify-between gap-1 lg:min-h-0">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-secondary">{description}</span>
        )}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stroke-brand",
          checked
            ? "border-stroke-brand bg-surface-brand"
            : "border-stroke-primary bg-surface-tertiary",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-3.5 rounded-full bg-surface-primary shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
    </label>
  );
}

export function ShowMoreButton({
  expanded,
  hiddenCount,
  onClick,
}: {
  expanded: boolean;
  hiddenCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-my-3 flex w-fit items-center gap-1 rounded-sm py-3 text-sm font-medium text-text-brand hover:text-text-brand-dark lg:my-0 lg:py-0"
    >
      {expanded ? "Згорнути" : `Показати більше (${hiddenCount})`}
      <ArrowRightIcon
        size={18}
        className={cn("transition-transform", expanded && "-rotate-90")}
      />
    </button>
  );
}
