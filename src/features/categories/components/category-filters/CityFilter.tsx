"use client";

import { useState } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { searchUkrainianCities } from "@/features/products/components/create-product/form-utils";

import { FilterChip, FilterChips } from "./FilterControls";
import { POPULAR_CITIES, toggleValue } from "./lib/filter-state";

const MAX_CITY_SUGGESTIONS = 8;

export function CityFilter({
  value,
  onChange,
}: {
  value: string[];
  onChange: (cities: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  // Without a query: popular cities plus any other selected ones; with a query: official matches.
  const options = search.trim()
    ? searchUkrainianCities(search, MAX_CITY_SUGGESTIONS)
    : [...POPULAR_CITIES, ...value.filter((city) => !POPULAR_CITIES.includes(city))];

  return (
    <>
      <Input
        aria-label="Пошук міста"
        placeholder="Пошук міста"
        start={<SearchIcon className="size-full" />}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onClear={() => setSearch("")}
      />
      {options.length > 0 ? (
        <FilterChips>
          {options.map((city) => (
            <FilterChip
              key={city}
              selected={value.includes(city)}
              onToggle={() => onChange(toggleValue(value, city))}
            >
              {city}
            </FilterChip>
          ))}
        </FilterChips>
      ) : (
        <p className="text-sm text-text-secondary">Такого міста не знайдено</p>
      )}
    </>
  );
}
