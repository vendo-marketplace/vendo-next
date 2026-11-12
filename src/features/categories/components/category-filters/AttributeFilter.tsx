"use client";

import { useState } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import NumberInput from "@/components/ui/input/number-input";

import {
  FilterCheckbox,
  FilterChip,
  FilterChips,
  FilterSection,
  FilterSwitch,
  ShowMoreButton,
} from "./FilterControls";
import { getColorSwatch, isColorAttribute, shouldRenderAsChips } from "./lib/filter-display";
import { FilterHint } from "./FilterHint";
import { toggleValue, type AttributeValue } from "./lib/filter-state";
import type { FilterAttribute } from "./lib/mock-filter-attributes";

const VISIBLE_OPTIONS = 8;
const SEARCHABLE_FROM = 9;

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
  attribute: FilterAttribute;
  value: AttributeValue;
  onChange: (value: AttributeValue) => void;
}) {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const options = attribute.allowedValues ?? [];

  const toggle = (option: string) =>
    onChange({ ...value, values: toggleValue(value.values, option) });

  const renderAsChips =
    attribute.display === "chips" ||
    (attribute.display !== "checkboxes" &&
      shouldRenderAsChips(options) &&
      !isColorAttribute(attribute));

  if (renderAsChips) {
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
          placeholder={attribute.searchPlaceholder ?? `Пошук: ${attribute.title.toLowerCase()}`}
          start={<SearchIcon className="size-full" />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
        />
      )}
      <div className={withSwatches ? "flex flex-col lg:gap-3.5" : "flex flex-col lg:gap-3"}>
        {visible.map((option) => (
          <FilterCheckbox
            key={option}
            label={option}
            checked={value.values.includes(option)}
            onChange={() => toggle(option)}
            count={attribute.optionCounts?.[option]}
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
  defaultOpen,
  last,
}: {
  attribute: FilterAttribute;
  value: AttributeValue;
  onChange: (value: AttributeValue) => void;
  defaultOpen?: boolean;
  last?: boolean;
}) {
  const sectionProps = {
    title: attribute.title,
    hint: attribute.hint && <FilterHint label={attribute.title} hint={attribute.hint} />,
    defaultOpen,
    last,
  };

  if (attribute.type === "BOOLEAN") {
    return (
      <FilterSection {...sectionProps} collapsible={false}>
        <FilterSwitch
          label={toPresenceLabel(attribute.title)}
          description={attribute.description}
          checked={value.values[0] === "true"}
          onChange={(checked) => onChange({ ...value, values: checked ? ["true"] : [] })}
        />
      </FilterSection>
    );
  }

  if (attribute.type === "ENUM") {
    return (
      <FilterSection {...sectionProps}>
        <EnumOptions attribute={attribute} value={value} onChange={onChange} />
      </FilterSection>
    );
  }

  if (attribute.type === "RANGE") {
    return (
      <FilterSection {...sectionProps}>
        <div className="flex gap-4">
          <NumberInput
            size="base"
            aria-label={`${attribute.title}: від`}
            placeholder="Від"
            value={value.min}
            onValueChange={(min) => onChange({ ...value, min })}
          />
          <NumberInput
            size="base"
            aria-label={`${attribute.title}: до`}
            placeholder="До"
            value={value.max}
            onValueChange={(max) => onChange({ ...value, max })}
          />
        </div>
      </FilterSection>
    );
  }

  if (attribute.type === "NUMBER") {
    return (
      <FilterSection {...sectionProps}>
        <NumberInput
          size="base"
          aria-label={attribute.title}
          placeholder="Значення"
          value={value.min}
          onValueChange={(min) => onChange({ ...value, min })}
        />
      </FilterSection>
    );
  }

  return null;
}
