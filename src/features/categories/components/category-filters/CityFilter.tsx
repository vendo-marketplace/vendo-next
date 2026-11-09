"use client";

import { useState } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { UKRAINIAN_CITIES } from "@/features/products/constants/ukrainian-cities";

import { POPULAR_CITIES } from "./category-filters";
import { FilterChip, FilterChips } from "./FilterControls";

const MAX_CITY_SUGGESTIONS = 8;

const normalize = (city: string) => city.trim().toLocaleLowerCase("uk");

const searchCities = (query: string) =>
  UKRAINIAN_CITIES.filter((city) => normalize(city).includes(query))
    .sort(
      (left, right) =>
        Number(normalize(right).startsWith(query)) - Number(normalize(left).startsWith(query)) ||
        left.localeCompare(right, "uk"),
    )
    .slice(0, MAX_CITY_SUGGESTIONS);

export function CityFilter({
  value,
  onChange,
}: {
  value: string[];
  onChange: (cities: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const query = normalize(search);

  // Without a query: popular cities plus any other selected ones; with a query: official city matches.
  const options = query
    ? searchCities(query)
    : [...POPULAR_CITIES, ...value.filter((city) => !POPULAR_CITIES.includes(city))];

  const toggle = (city: string) =>
    onChange(
      value.includes(city) ? value.filter((selected) => selected !== city) : [...value, city],
    );

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
            <FilterChip key={city} selected={value.includes(city)} onToggle={() => toggle(city)}>
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
