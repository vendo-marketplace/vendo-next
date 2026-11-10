"use client";

import { CrossIcon } from "@/assets/icons/CrossIcon";

import type { ActiveFilterChip } from "./lib/active-filter-chips";

export function ActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
}: {
  chips: ActiveFilterChip[];
  onRemove: (chip: ActiveFilterChip) => void;
  onClearAll: () => void;
}) {
  if (chips.length === 0) return null;

  return (
    <ul aria-label="Вибрані фільтри" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => onRemove(chip)}
            aria-label={`Прибрати фільтр «${chip.label}»`}
            className="flex items-center gap-2 rounded-lg border border-stroke-brand-subtle bg-surface-brand-subtle px-3 py-1.5 text-sm font-semibold text-text-brand transition-colors hover:border-stroke-brand"
          >
            {chip.label}
            <CrossIcon size={16} />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-lg border border-stroke-primary-subtle bg-surface-primary px-3 py-1.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-secondary"
        >
          Очистити всі
        </button>
      </li>
    </ul>
  );
}
