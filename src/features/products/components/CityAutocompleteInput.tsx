import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Map as MapIcon, MapPin } from "lucide-react";

import { Input } from "@/components/ui/input/input";
import {
  UKRAINIAN_CITIES,
  UKRAINIAN_REGIONS,
  findCityRegion,
  type UkrainianRegion,
} from "@/features/products/constants/ukrainian-cities";

const MAX_CITY_SUGGESTIONS = 20;

type CityAutocompleteInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  /** Adds an option on top of the region list that clears the city, e.g. "Уся Україна". */
  anyCityLabel?: string;
  onChange: (value: string) => void;
};

const searchCities = (query: string) =>
  UKRAINIAN_CITIES.filter((city) => city.toLocaleLowerCase("uk").includes(query))
    .sort((left, right) => {
      const leftStartsWithQuery = left.toLocaleLowerCase("uk").startsWith(query);
      const rightStartsWithQuery = right.toLocaleLowerCase("uk").startsWith(query);

      return (
        Number(rightStartsWithQuery) - Number(leftStartsWithQuery) ||
        left.localeCompare(right, "uk")
      );
    })
    .slice(0, MAX_CITY_SUGGESTIONS);

export default function CityAutocompleteInput({
  id,
  label,
  value,
  placeholder,
  required = false,
  anyCityLabel,
  onChange,
}: CityAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [browsedRegion, setBrowsedRegion] = useState<UkrainianRegion | null>(null);

  const query = value.trim().toLocaleLowerCase("uk");
  const selectedRegion = findCityRegion(value);
  const isSearching = Boolean(query) && !selectedRegion;
  const searchResults = useMemo(
    () => (isSearching ? searchCities(query) : []),
    [isSearching, query],
  );

  const selectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  // Reopen at the selected city's region.
  const openList = () => {
    setBrowsedRegion(selectedRegion ?? null);
    setIsOpen(true);
  };

  const renderList = () => {
    if (isSearching) {
      return searchResults.length ? (
        searchResults.map((city) => (
          <ListOption
            key={city}
            icon={<MapPin aria-hidden="true" className="size-4" />}
            label={city}
            description={findCityRegion(city)?.name}
            selected={value === city}
            onSelect={() => selectCity(city)}
          />
        ))
      ) : (
        <p className="px-3 py-2 text-xs text-text-tertiary">Місто не знайдено.</p>
      );
    }

    if (browsedRegion) {
      return (
        <>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setBrowsedRegion(null)}
            // -top-1.5 matches the list's p-1.5, so the header sticks to the very edge
            // and scrolled cities don't show through the padding above it.
            className="sticky -top-1.5 z-10 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition hover:bg-surface-primary-subtle"
          >
            <ChevronLeft aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
            <span className="break-words">{browsedRegion.name}</span>
          </button>
          {browsedRegion.cities.map((city) => (
            <ListOption
              key={city}
              icon={<MapPin aria-hidden="true" className="size-4" />}
              label={city}
              selected={value === city}
              onSelect={() => selectCity(city)}
            />
          ))}
        </>
      );
    }

    return (
      <>
        {anyCityLabel && (
          <ListOption
            icon={<MapIcon aria-hidden="true" className="size-4" />}
            label={anyCityLabel}
            description="Оголошення зі всієї країни"
            selected={!value}
            onSelect={() => selectCity("")}
          />
        )}
        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-text-tertiary">
          Оберіть область
        </p>
        {UKRAINIAN_REGIONS.map((region) => (
          <ListOption
            key={region.name}
            label={region.name}
            hasChildren
            onSelect={() => setBrowsedRegion(region)}
          />
        ))}
      </>
    );
  };

  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}{required && <span className="ml-1 text-text-brand">*</span>}
      </label>
      <Input
        id={id}
        size="sm"
        containerClassName="w-full min-w-0"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setBrowsedRegion(null);
          setIsOpen(true);
        }}
        onClear={() => {
          onChange("");
          setBrowsedRegion(null);
          setIsOpen(true);
        }}
        onFocus={openList}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={`${id}-suggestions`}
        aria-expanded={isOpen}
        className="h-5 px-3.5"
      />

      {isOpen && (
        <div
          // Remounting on view change resets the scroll to the top.
          key={isSearching ? "search" : (browsedRegion?.name ?? "regions")}
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-stroke-primary-subtle bg-white p-1.5 shadow-lg"
        >
          {renderList()}
        </div>
      )}
    </div>
  );
}

function ListOption({
  icon,
  label,
  description,
  selected = false,
  hasChildren = false,
  onSelect,
}: {
  icon?: ReactNode;
  label: string;
  description?: string;
  selected?: boolean;
  hasChildren?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-surface-primary-subtle"
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon && <span className="shrink-0 text-text-tertiary">{icon}</span>}
        <span className="min-w-0">
          <span className="block text-sm font-medium leading-5 break-words">{label}</span>
          {description && (
            <span className="block text-xs text-text-tertiary break-words">{description}</span>
          )}
        </span>
      </span>
      {hasChildren ? (
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
      ) : (
        selected && <Check aria-hidden="true" className="size-4 shrink-0 text-text-brand" />
      )}
    </button>
  );
}
