import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input/input";
import { searchUkrainianCities } from "@/features/products/components/create-product/form-utils";

const MAX_CITY_SUGGESTIONS = 12;

type CityAutocompleteInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export default function CityAutocompleteInput({
  id,
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: CityAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = useMemo(
    () => searchUkrainianCities(value, MAX_CITY_SUGGESTIONS),
    [value],
  );

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
          setIsOpen(true);
        }}
        onClear={() => {
          onChange("");
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
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
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-stroke-primary-subtle bg-white p-1.5 shadow-lg"
        >
          {suggestions.length ? (
            suggestions.map((city) => (
              <button
                key={city}
                type="button"
                role="option"
                aria-selected={value === city}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(city);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-surface-primary-subtle"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
                  <span className="block truncate text-sm font-medium">{city}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-text-tertiary">Місто не знайдено.</p>
          )}
        </div>
      )}
    </div>
  );
}
