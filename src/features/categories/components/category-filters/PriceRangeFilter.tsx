"use client";

import { Input } from "@/components/ui/input/input";

import {
  keepDigits,
  PRICE_SLIDER_MAX,
  PRICE_SLIDER_STEP,
  type PriceRange,
} from "./lib/filter-state";

const clamp = (value: number) => Math.min(Math.max(value, 0), PRICE_SLIDER_MAX);

const toPercent = (value: number) => (value / PRICE_SLIDER_MAX) * 100;

export function PriceRangeFilter({
  value,
  onChange,
}: {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}) {
  const sliderMin = value.min === "" ? 0 : clamp(Number(value.min));
  const sliderMax = value.max === "" ? PRICE_SLIDER_MAX : clamp(Number(value.max));

  // Thumbs sitting on the slider ends mean "no bound", so they clear the field.
  const changeMin = (next: number) =>
    onChange({ ...value, min: next === 0 ? "" : String(Math.min(next, sliderMax)) });
  const changeMax = (next: number) =>
    onChange({
      ...value,
      max: next === PRICE_SLIDER_MAX ? "" : String(Math.max(next, sliderMin)),
    });

  return (
    <>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-xl bg-surface-tertiary" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-xl bg-surface-brand"
          style={{ left: `${toPercent(sliderMin)}%`, right: `${100 - toPercent(sliderMax)}%` }}
        />
        <input
          type="range"
          aria-label="Мінімальна ціна"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={sliderMin}
          onChange={(event) => changeMin(Number(event.target.value))}
          className="range-thumb"
        />
        <input
          type="range"
          aria-label="Максимальна ціна"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={sliderMax}
          onChange={(event) => changeMax(Number(event.target.value))}
          className="range-thumb"
        />
      </div>
      <div className="flex gap-4">
        <Input
          inputMode="numeric"
          aria-label="Ціна від"
          placeholder="Від 0"
          clearable={false}
          value={value.min}
          onChange={(event) => onChange({ ...value, min: keepDigits(event.target.value) })}
        />
        <Input
          inputMode="numeric"
          aria-label="Ціна до"
          placeholder="До"
          clearable={false}
          value={value.max}
          onChange={(event) => onChange({ ...value, max: keepDigits(event.target.value) })}
        />
      </div>
    </>
  );
}
