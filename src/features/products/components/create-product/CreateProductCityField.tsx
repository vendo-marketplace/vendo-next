import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input/input";
import { UKRAINIAN_CITIES } from "@/features/products/constants/ukrainian-cities";

type CreateProductCityFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const MAX_CITY_SUGGESTIONS = 12;

export default function CreateProductCityField({
  value,
  onChange,
}: CreateProductCityFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = useMemo(() => {
    const query = value.trim().toLocaleLowerCase("uk");
    if (!query) return UKRAINIAN_CITIES.slice(0, MAX_CITY_SUGGESTIONS);

    return UKRAINIAN_CITIES
      .filter((city) => city.toLocaleLowerCase("uk").includes(query))
      .sort((left, right) => {
        const leftStartsWithQuery = left.toLocaleLowerCase("uk").startsWith(query);
        const rightStartsWithQuery = right.toLocaleLowerCase("uk").startsWith(query);

        return (
          Number(rightStartsWithQuery) - Number(leftStartsWithQuery) ||
          left.localeCompare(right, "uk")
        );
      })
      .slice(0, MAX_CITY_SUGGESTIONS);
  }, [value]);

  return (
    <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
      <div className="mb-6 flex gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand">
          <MapPin aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="font-semibold">Місто товару</p>
          <p className="mt-1 text-sm text-text-secondary">
            Оберіть місто зі списку українських міст.
          </p>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="product-city" className="mb-2 block text-sm font-medium">
          Місто <span className="text-text-brand">*</span>
        </label>
        <Input
          id="product-city"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder="Почніть вводити назву міста"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="city-suggestions"
          aria-expanded={isOpen}
          className="h-12 px-3.5"
        />

        {isOpen && (
          <div
            id="city-suggestions"
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
                  <span className="block truncate text-sm font-medium">{city}</span>
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-text-tertiary">Місто не знайдено.</p>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-text-tertiary">
        Введіть кілька літер або відкрийте список, щоб швидко знайти місто.
      </p>
    </section>
  );
}
