"use client";

import { useState } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";

import type { CategoryAttribute } from "../../types/category";
import {
  getColorSwatch,
  isColorAttribute,
  shouldRenderAsChips,
  type AttributeValue,
} from "./category-filters";
import {
  FilterCheckbox,
  FilterChip,
  FilterChips,
  FilterSection,
  FilterSwitch,
  ShowMoreButton,
} from "./FilterControls";

const VISIBLE_OPTIONS = 8;
const SEARCHABLE_FROM = 9;

const toDigits = (value: string) => value.replace(/[^\d.,]/g, "");

// "Гарантія" -> "Є гарантія"; keeps acronyms like "NFC" intact.
const toPresenceLabel = (title: string) => {
  const isAcronym = title.length > 1 && title[1] === title[1].toUpperCase();
  return `Є ${isAcronym ? title : title[0].toLowerCase() + title.slice(1)}`;
};

function EnumOptions({
  attribute,
  value,
  onChange,
}: {
  attribute: CategoryAttribute;
  value: AttributeValue;
  onChange: (value: AttributeValue) => void;
}) {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const options = attribute.allowedValues ?? [];

  const toggle = (option: string) =>
    onChange({
      ...value,
      values: value.values.includes(option)
        ? value.values.filter((selected) => selected !== option)
        : [...value.values, option],
    });

  if (shouldRenderAsChips(options) && !isColorAttribute(attribute)) {
    return (
      <FilterChips>
        {options.map((option) => (
          <FilterChip
            key={option}
            selected={value.values.includes(option)}
            onToggle={() => toggle(option)}
          >
            {option}
          </FilterChip>
        ))}
      </FilterChips>
    );
  }

  const query = search.trim().toLowerCase();
  const matching = options.filter((option) => option.toLowerCase().includes(query));
  const visible = isExpanded || query ? matching : matching.slice(0, VISIBLE_OPTIONS);
  const hiddenCount = matching.length - VISIBLE_OPTIONS;
  const withSwatches = isColorAttribute(attribute);

  return (
    <>
      {options.length >= SEARCHABLE_FROM && (
        <Input
          aria-label={`Пошук: ${attribute.title}`}
          placeholder={`Пошук: ${attribute.title.toLowerCase()}`}
          start={<SearchIcon className="size-full" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
        />
      )}
      <div className={withSwatches ? "flex flex-col gap-3.5" : "flex flex-col gap-3"}>
        {visible.map((option) => (
          <FilterCheckbox
            key={option}
            label={option}
            checked={value.values.includes(option)}
            onChange={() => toggle(option)}
            swatch={withSwatches ? getColorSwatch(option) : undefined}
          />
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-text-secondary">Нічого не знайдено</p>
        )}
      </div>
      {!query && hiddenCount > 0 && (
        <ShowMoreButton
          expanded={isExpanded}
          hiddenCount={hiddenCount}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        />
      )}
    </>
  );
}

export function AttributeFilter({
  attribute,
  value,
  onChange,
  last,
}: {
  attribute: CategoryAttribute;
  value: AttributeValue;
  onChange: (value: AttributeValue) => void;
  last?: boolean;
}) {
  if (attribute.type === "BOOLEAN") {
    return (
      <FilterSection title={attribute.title} collapsible={false} last={last}>
        <FilterSwitch
          label={toPresenceLabel(attribute.title)}
          checked={value.values[0] === "true"}
          onChange={(checked) => onChange({ ...value, values: checked ? ["true"] : [] })}
        />
      </FilterSection>
    );
  }

  if (attribute.type === "ENUM") {
    return (
      <FilterSection title={attribute.title} last={last}>
        <EnumOptions attribute={attribute} value={value} onChange={onChange} />
      </FilterSection>
    );
  }

  if (attribute.type === "RANGE") {
    return (
      <FilterSection title={attribute.title} last={last}>
        <div className="flex gap-4">
          <Input
            inputMode="decimal"
            aria-label={`${attribute.title}: від`}
            placeholder="Від"
            clearable={false}
            value={value.min}
            onChange={(event) => onChange({ ...value, min: toDigits(event.target.value) })}
          />
          <Input
            inputMode="decimal"
            aria-label={`${attribute.title}: до`}
            placeholder="До"
            clearable={false}
            value={value.max}
            onChange={(event) => onChange({ ...value, max: toDigits(event.target.value) })}
          />
        </div>
      </FilterSection>
    );
  }

  if (attribute.type === "NUMBER") {
    return (
      <FilterSection title={attribute.title} last={last}>
        <Input
          inputMode="decimal"
          aria-label={attribute.title}
          placeholder="Значення"
          clearable={false}
          value={value.min}
          onChange={(event) => onChange({ ...value, min: toDigits(event.target.value) })}
        />
      </FilterSection>
    );
  }

  return null;
}
