import NumberInput from "@/components/ui/input/number-input";
import type { CategoryAttribute } from "@/features/categories/types/category";

export type AttributeFilterValue = {
  values: string[];
  min: string;
  max: string;
};

export const EMPTY_ATTRIBUTE_FILTER: AttributeFilterValue = {
  values: [],
  min: "",
  max: "",
};

export const FILTER_LABEL_CLASS_NAME =
  "text-sm font-medium leading-5 text-text-primary";

type Props = {
  attributes: CategoryAttribute[];
  values: Record<string, AttributeFilterValue>;
  onChange: (attributeId: string, value: AttributeFilterValue) => void;
};

function AttributeControl({
  attribute,
  value,
  onChange,
}: {
  attribute: CategoryAttribute;
  value: AttributeFilterValue;
  onChange: (value: AttributeFilterValue) => void;
}) {
  if (attribute.type === "ENUM") {
    return (
      <fieldset className="grid gap-2">
        <legend className={FILTER_LABEL_CLASS_NAME}>{attribute.title}</legend>
        {(attribute.allowedValues ?? []).map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-sm leading-5 text-text-secondary"
          >
            <input
              type="checkbox"
              checked={value.values.includes(option)}
              onChange={(event) =>
                onChange({
                  ...value,
                  values: event.target.checked
                    ? [...value.values, option]
                    : value.values.filter((selected) => selected !== option),
                })
              }
              className="size-4 accent-surface-brand"
            />
            {option}
          </label>
        ))}
      </fieldset>
    );
  }

  if (attribute.type === "BOOLEAN") {
    return (
      <label className={`grid gap-2 ${FILTER_LABEL_CLASS_NAME}`}>
        {attribute.title}
        <select
          className="h-10 rounded-lg border border-stroke-primary bg-surface-primary px-3 text-sm font-normal"
          value={value.values[0] ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              values: event.target.value ? [event.target.value] : [],
            })
          }
        >
          <option value="">Усі</option>
          <option value="true">Так</option>
          <option value="false">Ні</option>
        </select>
      </label>
    );
  }

  if (attribute.type === "RANGE") {
    return (
      <fieldset className="grid gap-2">
        <legend className={FILTER_LABEL_CLASS_NAME}>{attribute.title}</legend>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            containerClassName="min-w-0"
            value={value.min}
            onValueChange={(min) => onChange({ ...value, min })}
            placeholder="Від"
            aria-label={`${attribute.title}: від`}
          />
          <NumberInput
            containerClassName="min-w-0"
            value={value.max}
            onValueChange={(max) => onChange({ ...value, max })}
            placeholder="До"
            aria-label={`${attribute.title}: до`}
          />
        </div>
      </fieldset>
    );
  }

  if (attribute.type === "NUMBER") {
    const inputId = `filter-${attribute.id}`;
    return (
      <div className={`grid gap-2 ${FILTER_LABEL_CLASS_NAME}`}>
        <label htmlFor={inputId}>{attribute.title}</label>
        <NumberInput
          id={inputId}
          containerClassName="w-full"
          value={value.min}
          onValueChange={(min) => onChange({ ...value, min })}
          placeholder="Значення"
        />
      </div>
    );
  }

  return null;
}

export function toAttributeFilters(
  attributes: CategoryAttribute[],
  values: Record<string, AttributeFilterValue>,
) {
  return attributes.flatMap((attribute) => {
    const value = values[attribute.id] ?? EMPTY_ATTRIBUTE_FILTER;
    if (attribute.type === "ENUM" || attribute.type === "BOOLEAN") {
      return value.values.length
        ? [{ id: attribute.id, values: value.values }]
        : [];
    }
    if (attribute.type === "RANGE") {
      return value.min || value.max
        ? [{ id: attribute.id, values: [value.min, value.max] }]
        : [];
    }
    if (attribute.type === "NUMBER" && value.min !== "") {
      return [{ id: attribute.id, values: [value.min] }];
    }
    return [];
  });
}

export default function CategoryAttributeFilters({
  attributes,
  values,
  onChange,
}: Props) {
  return (
    <>
      {attributes
        .filter((attribute) => attribute.type !== "STRING")
        .map((attribute) => (
          <AttributeControl
            key={attribute.id}
            attribute={attribute}
            value={values[attribute.id] ?? EMPTY_ATTRIBUTE_FILTER}
            onChange={(value) => onChange(attribute.id, value)}
          />
        ))}
    </>
  );
}
