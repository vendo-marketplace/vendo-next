"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { AngleDownIcon } from "@/assets/icons/AngleDownIcon";
import { CrossIcon } from "@/assets/icons/CrossIcon";
import { cn } from "@/utils/utils";

import type { ActiveFilterChip } from "./lib/active-filter-chips";

const GAP = 8;

const chipClassName =
  "flex h-8.5 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-stroke-brand-subtle bg-surface-brand-subtle px-3 text-sm font-semibold text-text-brand transition-colors hover:border-stroke-brand";

const controlClassName =
  "flex h-8.5 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-stroke-primary-subtle bg-surface-primary px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-secondary";

// How many chips fit on one row next to the "Ще N" and "Очистити все" controls.
const countFittingChips = (
  available: number,
  chipWidths: number[],
  moreWidth: number,
  clearWidth: number,
) => {
  const total = chipWidths.reduce((sum, width) => sum + width + GAP, 0) + clearWidth;
  if (total <= available) return chipWidths.length;

  let used = moreWidth + GAP + clearWidth;
  let count = 0;
  for (const width of chipWidths) {
    if (used + width + GAP > available) break;
    used += width + GAP;
    count += 1;
  }
  return count;
};

function ChipContent({ label }: { label: string }) {
  return (
    <>
      {label}
      <CrossIcon size={16} />
    </>
  );
}

// Inside the mobile filters panel: what is picked, with "Скинути" first, wrapping over lines.
export function SelectedFiltersBlock({
  chips,
  onRemove,
  onClearAll,
}: {
  chips: ActiveFilterChip[];
  onRemove: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
}) {
  if (!chips.length) return null;
  return (
    <section className="flex flex-col gap-3 border-b border-stroke-secondary px-4 pt-4 pb-5">
      <h3 className="font-sans text-md font-semibold text-text-primary">Вибрані фільтри</h3>
      <ul aria-label="Вибрані фільтри" className="flex flex-wrap gap-2">
        <li>
          <button type="button" onClick={onClearAll} className={controlClassName}>
            Скинути
            <CrossIcon size={16} />
          </button>
        </li>
        {chips.map((chip) => (
          <li key={chip.key} className="min-w-0">
            <button
              type="button"
              onClick={() => onRemove(chip)}
              aria-label={`Прибрати фільтр «${chip.label}»`}
              className={cn(chipClassName, "max-w-full")}
            >
              <span className="truncate">{chip.label}</span>
              <CrossIcon size={16} className="shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Phones and tablets: the "Очистити все" button first, then every chip in one row that scrolls sideways,
// so the choices are always visible instead of hiding behind "Ще N". A fade on the right edge
// hints that more chips follow.
function ScrollingChipRow({
  chips,
  onRemove,
  onClearAll,
}: {
  chips: ActiveFilterChip[];
  onRemove: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
}) {
  const rowRef = useRef<HTMLUListElement>(null);
  const [hasMoreRight, setHasMoreRight] = useState(false);

  const updateFade = () => {
    const row = rowRef.current;
    if (row) setHasMoreRight(row.scrollLeft + row.clientWidth < row.scrollWidth - 1);
  };

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(updateFade);
    observer.observe(row);
    return () => observer.disconnect();
  }, [chips.length]);

  return (
    <div className="relative -mx-4 lg:hidden">
      <ul
        ref={rowRef}
        aria-label="Вибрані фільтри"
        onScroll={updateFade}
        className="flex snap-x scroll-px-4 items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <li className="shrink-0 snap-start">
          <button type="button" onClick={onClearAll} className={controlClassName}>
            Очистити все
            <CrossIcon size={16} />
          </button>
        </li>
        {chips.map((chip) => (
          <li key={chip.key} className="snap-start">
            <button
              type="button"
              onClick={() => onRemove(chip)}
              aria-label={`Прибрати фільтр «${chip.label}»`}
              className={chipClassName}
            >
              <ChipContent label={chip.label} />
            </button>
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-surface-secondary to-transparent transition-opacity",
          hasMoreRight ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export function ActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
}: {
  chips: ActiveFilterChip[];
  onRemove: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // Unknown until the row is measured; until then every chip is shown.
  const [fittingCount, setFittingCount] = useState<number | null>(null);
  const hasChips = chips.length > 0;

  // A hidden copy of the row is measured whenever the width or the chips change.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (!wrapper || !measure) return;

    const observer = new ResizeObserver(() => {
      const items = Array.from(measure.children) as HTMLElement[];
      const chipWidths = items.slice(0, -2).map((item) => item.offsetWidth);
      const [moreWidth, clearWidth] = items.slice(-2).map((item) => item.offsetWidth);
      setFittingCount(countFittingChips(wrapper.clientWidth, chipWidths, moreWidth, clearWidth));
    });
    observer.observe(wrapper);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [hasChips]);

  if (!hasChips) return null;

  const shownChips = isExpanded || fittingCount === null ? chips : chips.slice(0, fittingCount);
  const hiddenCount = chips.length - shownChips.length;

  return (
    <>
      <ScrollingChipRow chips={chips} onRemove={onRemove} onClearAll={onClearAll} />

      <div ref={wrapperRef} className="relative hidden lg:block">
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 flex w-max gap-2"
        >
          {chips.map((chip) => (
            <span key={chip.key} className={chipClassName}>
              <ChipContent label={chip.label} />
            </span>
          ))}
          <span className={controlClassName}>
            Ще {chips.length}
            <AngleDownIcon size={16} />
          </span>
          <span className={controlClassName}>
            Очистити все
            <CrossIcon size={16} />
          </span>
        </div>

        <ul aria-label="Вибрані фільтри" className="flex flex-wrap gap-2">
          {shownChips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={() => onRemove(chip)}
                aria-label={`Прибрати фільтр «${chip.label}»`}
                className={chipClassName}
              >
                <ChipContent label={chip.label} />
              </button>
            </li>
          ))}
          {(hiddenCount > 0 || isExpanded) && (
            <li>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded ? "Згорнути вибрані фільтри" : `Показати ще ${hiddenCount} вибраних фільтрів`
                }
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className={controlClassName}
              >
                {isExpanded ? "Згорнути" : `Ще ${hiddenCount}`}
                <AngleDownIcon
                  size={16}
                  className={cn("transition-transform", isExpanded && "rotate-180")}
                />
              </button>
            </li>
          )}
          <li>
            <button type="button" onClick={onClearAll} className={controlClassName}>
              Очистити все
              <CrossIcon size={16} />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
