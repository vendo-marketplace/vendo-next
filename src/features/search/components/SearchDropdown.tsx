"use client";

import { useId } from "react";

import { ClockIcon } from "@/assets/icons";
import { ArrowUpLeftIcon, CloseIcon, NavSearchSmallIcon } from "@/assets/icons/NavIcons";
import { cn } from "@/utils/utils";

import { POPULAR_SEARCHES } from "../lib/popular-searches";

type Props = {
  id: string;
  listboxId: string;
  query: string;
  // Past searches when the field is empty, suggestions while typing.
  options: string[];
  activeIndex: number;
  getOptionId: (index: number) => string;
  onActiveIndexChange: (index: number) => void;
  onSelect: (value: string) => void;
  onFill: (value: string) => void;
  onRemove: (value: string) => void;
  onClear: () => void;
};

// The typed part is quieter, so the rest of the suggestion stands out (Figma 5372-18751).
function HighlightedText({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLocaleLowerCase("uk");
  const start = needle ? text.toLocaleLowerCase("uk").indexOf(needle) : -1;
  if (start < 0) return text;
  const end = start + needle.length;
  return (
    <>
      {text.slice(0, start)}
      <span className="text-text-secondary">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  );
}

const sectionTitleClassName = "px-1.5 text-xs font-medium text-text-secondary";

// Hover and the keyboard share one "active" row; 32px rows on larger screens, 40px on phones.
const optionClassName =
  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1.5 py-1.5 transition-colors aria-selected:bg-surface-brand-subtle max-md:py-2.5";

// A small icon button at the end of a row, with a 30px hit area.
const rowActionClassName =
  "relative flex size-3.5 shrink-0 items-center justify-center text-text-tertiary transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-text-primary";

// Figma 5343-22761 (history and popular), 5530-26144 (no history yet) and 5372-18751 (typing).
// A card under the field on tablets and desktops; on phones it fills the screen below the
// search row. Mouse-down never steals focus from the field, so it stays open while clicking.
export function SearchDropdown({
  id,
  listboxId,
  query,
  options,
  activeIndex,
  getOptionId,
  onActiveIndexChange,
  onSelect,
  onFill,
  onRemove,
  onClear,
}: Props) {
  const historyTitleId = useId();
  const popularTitleId = useId();
  const isTyping = query.trim().length > 0;

  const renderOption = (value: string, index: number) => (
    <li
      key={value}
      id={getOptionId(index)}
      role="option"
      aria-selected={index === activeIndex}
      onClick={() => onSelect(value)}
      onMouseMove={() => index !== activeIndex && onActiveIndexChange(index)}
      className={optionClassName}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {isTyping ? (
          <NavSearchSmallIcon size={16} className="shrink-0 text-text-tertiary" />
        ) : (
          <ClockIcon size={16} className="shrink-0 text-text-tertiary" />
        )}
        <span className="truncate text-sm font-medium text-text-primary">
          {isTyping ? <HighlightedText text={value} query={query} /> : value}
        </span>
      </span>
      {isTyping ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Підставити «${value}» у пошук`}
          onClick={(event) => {
            event.stopPropagation();
            onFill(value);
          }}
          className={rowActionClassName}
        >
          <ArrowUpLeftIcon size={14} />
        </button>
      ) : (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Видалити «${value}» з історії`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(value);
          }}
          className={rowActionClassName}
        >
          <CloseIcon size={14} />
        </button>
      )}
    </li>
  );

  return (
    <div
      id={id}
      onMouseDown={(event) => event.preventDefault()}
      className={cn(
        "absolute inset-x-0 top-full z-10 mt-2.5 flex max-h-[calc(100dvh-6rem)] animate-in flex-col gap-4 overflow-y-auto rounded-lg border border-stroke-secondary bg-surface-primary px-3 pt-3 pb-4 shadow-xs fade-in-0",
        "max-md:fixed max-md:top-14 max-md:bottom-0 max-md:mt-0 max-md:max-h-none max-md:overscroll-contain max-md:rounded-none max-md:border-0 max-md:px-2.5 max-md:pt-4 max-md:pb-[calc(1rem+env(safe-area-inset-bottom))]",
      )}
    >
      {isTyping ? (
        <ul id={listboxId} role="listbox" aria-label="Підказки пошуку" className="flex flex-col">
          {options.map(renderOption)}
        </ul>
      ) : (
        <>
          {options.length > 0 && (
            <section aria-labelledby={historyTitleId} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 id={historyTitleId} className={sectionTitleClassName}>
                  Історія пошуку
                </h2>
                <button
                  type="button"
                  onClick={onClear}
                  className="relative px-1.5 text-xs text-text-brand transition-colors after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] hover:text-text-brand-dark"
                >
                  Очистити
                </button>
              </div>
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={historyTitleId}
                className="flex flex-col border-b border-stroke-secondary pb-2"
              >
                {options.map(renderOption)}
              </ul>
            </section>
          )}
          <section aria-labelledby={popularTitleId} className="flex flex-col gap-2">
            <h2 id={popularTitleId} className={sectionTitleClassName}>
              Популярне
            </h2>
            <ul className="flex flex-wrap gap-2.5 px-1.5">
              {POPULAR_SEARCHES.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => onSelect(value)}
                    className="rounded-lg border border-stroke-primary-subtle bg-surface-primary px-3 pt-1 pb-1.5 text-xs font-medium text-text-primary transition-colors hover:border-stroke-brand hover:text-text-brand max-md:px-3.5 max-md:py-2"
                  >
                    {value}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
