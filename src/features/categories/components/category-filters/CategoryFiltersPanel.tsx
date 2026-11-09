"use client";

import { FilterIcon } from "@/assets/icons/FilterIcon";

import type { CategoryAttribute } from "../../types/category";
import { AttributeFilter } from "./AttributeFilter";
import {
  CONDITION_OPTIONS,
  EMPTY_ATTRIBUTE_VALUE,
  type CategoryFilters,
} from "./category-filters";
import { CityFilter } from "./CityFilter";
import { FilterChip, FilterChips, FilterSection } from "./FilterControls";
import { PriceRangeFilter } from "./PriceRangeFilter";

export function CategoryFiltersPanel({
  id,
  filters,
  attributes,
  onChange,
}: {
  id?: string;
  filters: CategoryFilters;
  attributes: CategoryAttribute[];
  onChange: (filters: CategoryFilters) => void;
}) {
  const toggleCondition = (condition: CategoryFilters["conditions"][number]) =>
    onChange({
      ...filters,
      conditions: filters.conditions.includes(condition)
        ? filters.conditions.filter((selected) => selected !== condition)
        : [...filters.conditions, condition],
    });

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
            onChange={(cities) => onChange({ ...filters, cities })}
          />
        </FilterSection>

        <FilterSection title="Ціна, грн">
          <PriceRangeFilter
            value={filters.price}
            onChange={(price) => onChange({ ...filters, price })}
          />
        </FilterSection>

        <FilterSection title="Стан" last={attributes.length === 0}>
          <FilterChips>
            {CONDITION_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                selected={filters.conditions.includes(option.value)}
                onToggle={() => toggleCondition(option.value)}
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
              onChange({
                ...filters,
                attributes: { ...filters.attributes, [attribute.id]: value },
              })
            }
          />
        ))}
      </div>
    </aside>
  );
}
