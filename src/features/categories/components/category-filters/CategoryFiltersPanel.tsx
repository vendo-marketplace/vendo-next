"use client";

import { FilterIcon } from "@/assets/icons/FilterIcon";

import { AttributeFilter } from "./AttributeFilter";
import { CityFilter } from "./CityFilter";
import { FilterChip, FilterChips, FilterSection } from "./FilterControls";
import {
  CONDITION_OPTIONS,
  EMPTY_ATTRIBUTE_VALUE,
  toggleValue,
  type CategoryFilters,
} from "./lib/filter-state";
import type { FilterAttribute } from "./lib/mock-filter-attributes";
import { PriceRangeFilter } from "./PriceRangeFilter";

export function CategoryFiltersPanel({
  id,
  filters,
  attributes,
  onChange,
}: {
  id?: string;
  filters: CategoryFilters;
  attributes: FilterAttribute[];
  // Receives an updater so quick successive edits build on the latest filters.
  onChange: (update: (current: CategoryFilters) => CategoryFilters) => void;
}) {
  return (
    <aside
      id={id}
      aria-label="Фільтри"
      className="flex flex-col gap-5 rounded-lg border border-stroke-secondary/30 bg-surface-primary px-3 py-6 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-stroke-secondary pb-3">
        <FilterIcon size={20} />
        <h2 className="text-xl font-semibold text-text-primary">Фільтри</h2>
      </div>

      <div className="flex flex-col gap-4">
        <FilterSection title="Місто">
          <CityFilter
            value={filters.cities}
            onChange={(cities) => onChange((current) => ({ ...current, cities }))}
          />
        </FilterSection>

        <FilterSection title="Ціна, грн">
          <PriceRangeFilter
            value={filters.price}
            onChange={(price) => onChange((current) => ({ ...current, price }))}
          />
        </FilterSection>

        <FilterSection title="Стан" last={attributes.length === 0}>
          <FilterChips>
            {CONDITION_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                selected={filters.conditions.includes(option.value)}
                onToggle={() =>
                  onChange((current) => ({
                    ...current,
                    conditions: toggleValue(current.conditions, option.value),
                  }))
                }
              >
                {option.label}
              </FilterChip>
            ))}
          </FilterChips>
        </FilterSection>

        {attributes.map((attribute, index) => (
          <AttributeFilter
            key={attribute.id}
            attribute={attribute}
            last={index === attributes.length - 1}
            value={filters.attributes[attribute.id] ?? EMPTY_ATTRIBUTE_VALUE}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                attributes: { ...current.attributes, [attribute.id]: value },
              }))
            }
          />
        ))}
      </div>
    </aside>
  );
}
