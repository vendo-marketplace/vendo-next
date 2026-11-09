"use client";

import { Input } from "@/components/ui/input/input";

import { PRICE_SLIDER_MAX, PRICE_SLIDER_STEP } from "./category-filters";

type PriceRange = { min: string; max: string };

const thumbClassName =
  "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-stroke-secondary [&::-moz-range-thumb]:bg-surface-primary [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-stroke-secondary [&::-webkit-slider-thumb]:bg-surface-primary [&::-webkit-slider-thumb]:shadow-md focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-stroke-brand";

const toDigits = (value: string) => value.replace(/\D/g, "");

const clamp = (value: number) => Math.min(Math.max(value, 0), PRICE_SLIDER_MAX);

export function PriceRangeFilter({
  value,
  onChange,
}: {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}) {
  const sliderMin = value.min === "" ? 0 : clamp(Number(value.min));
  const sliderMax = value.max === "" ? PRICE_SLIDER_MAX : clamp(Number(value.max));
  const startPercent = (sliderMin / PRICE_SLIDER_MAX) * 100;
  const endPercent = (sliderMax / PRICE_SLIDER_MAX) * 100;

  return (
    <>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-xl bg-surface-tertiary" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-xl bg-surface-brand"
          style={{ left: `${startPercent}%`, right: `${100 - endPercent}%` }}
        />
        <input
          type="range"
          aria-label="Мінімальна ціна"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={sliderMin}
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), sliderMax);
            onChange({ ...value, min: next === 0 ? "" : String(next) });
          }}
          className={thumbClassName}
        />
        <input
          type="range"
          aria-label="Максимальна ціна"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={sliderMax}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), sliderMin);
            onChange({ ...value, max: next === PRICE_SLIDER_MAX ? "" : String(next) });
          }}
          className={thumbClassName}
        />
      </div>
      <div className="flex gap-4">
        <Input
          inputMode="numeric"
          aria-label="Ціна від"
          placeholder="Від 0"
          clearable={false}
          value={value.min}
          onChange={(event) => onChange({ ...value, min: toDigits(event.target.value) })}
        />
        <Input
          inputMode="numeric"
          aria-label="Ціна до"
          placeholder="До"
          clearable={false}
          value={value.max}
          onChange={(event) => onChange({ ...value, max: toDigits(event.target.value) })}
        />
      </div>
    </>
  );
}
