"use client";

import { useId, useState, type ReactNode } from "react";

import { AngleUpIcon } from "@/assets/icons/AngleUpIcon";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { TickIcon } from "@/assets/icons/TickIcon";
import { cn } from "@/utils/utils";

export function FilterSection({
  title,
  children,
  collapsible = true,
  last = false,
}: {
  title: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  last?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const contentId = useId();

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4",
        !last && "border-b border-stroke-secondary pb-6",
      )}
    >
      {collapsible ? (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-2 rounded-sm text-left text-md font-semibold text-text-primary"
        >
          {title}
          <AngleUpIcon
            size={20}
            className={cn("shrink-0 transition-transform", !isOpen && "rotate-180")}
          />
        </button>
      ) : (
        <h3 className="font-sans text-md font-semibold text-text-primary">{title}</h3>
      )}
      {isOpen && (
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
        "rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
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
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-text-primary">
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
          {/* TODO(api): counts per option need a facets endpoint. */}
          {count !== undefined && (
            <span className="font-normal text-text-tertiary"> ({count.toLocaleString("uk-UA")})</span>
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
    <label className="flex cursor-pointer items-center justify-between gap-1">
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
      className="flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-text-brand hover:text-text-brand-dark"
    >
      {expanded ? "Згорнути" : `Показати більше (${hiddenCount})`}
      <ArrowRightIcon
        size={18}
        className={cn("transition-transform", expanded && "-rotate-90")}
      />
    </button>
  );
}
