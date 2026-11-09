import { MapPin } from "lucide-react";

import CityAutocompleteInput from "@/features/products/components/CityAutocompleteInput";

type CreateProductCityFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CreateProductCityField({
  value,
  onChange,
}: CreateProductCityFieldProps) {
  return (
    <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-brand-subtle text-text-brand">
          <MapPin aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="font-semibold">Місто товару</p>
          <p className="mt-1 text-sm text-text-secondary">
            Оберіть місто зі списку українських міст.
          </p>
        </div>
      </div>

      <CityAutocompleteInput
        id="product-city"
        label="Місто"
        value={value}
        onChange={onChange}
        required
        placeholder="Почніть вводити назву міста"
      />

      <p className="mt-3 text-xs leading-5 text-text-tertiary">
        Введіть кілька літер або відкрийте список, щоб швидко знайти місто.
      </p>
    </section>
  );
}
