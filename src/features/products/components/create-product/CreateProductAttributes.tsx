import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/components/ui/input/input";
import type { CategoryAttribute } from "@/features/categories/types/category";

type CreateProductAttributesProps = {
  categoryTitle: string;
  attributes: CategoryAttribute[];
  values: Record<string, string[]>;
  onChange: (attributeId: string, value: string) => void;
};

const controlClass =
  "h-11 w-full rounded-xl border border-stroke-primary-subtle bg-white px-3.5 text-sm outline-none transition focus:border-stroke-brand";

function AttributeSelect({
  id,
  required,
  value,
  options,
  onChange,
}: {
  id: string;
  required: boolean;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${controlClass} appearance-none pr-10`}
      >
        <option value="">Оберіть значення</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3.5 size-4 text-text-tertiary"
      />
    </div>
  );
}

function AttributeField({
  attribute,
  value,
  onChange,
}: {
  attribute: CategoryAttribute;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `attribute-${attribute.id}`;

  let control: ReactNode;
  if (attribute.type === "ENUM") {
    control = (
      <AttributeSelect
        id={id}
        required={attribute.required}
        value={value}
        onChange={onChange}
        options={(attribute.allowedValues ?? []).map((option) => ({
          value: option,
          label: option,
        }))}
      />
    );
  } else if (attribute.type === "BOOLEAN") {
    control = (
      <AttributeSelect
        id={id}
        required={attribute.required}
        value={value}
        onChange={onChange}
        options={[
          { value: "true", label: "Так" },
          { value: "false", label: "Ні" },
        ]}
      />
    );
  } else {
    control = (
      <Input
        id={id}
        type={attribute.type === "NUMBER" ? "number" : "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={attribute.required}
        placeholder={
          attribute.type === "RANGE"
            ? "Наприклад: 10–20"
            : `Вкажіть ${attribute.title.toLowerCase()}`
        }
        className="h-11 px-3.5"
      />
    );
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm font-medium">
      <span className="whitespace-nowrap">
        {attribute.title}
        {attribute.required && <span className="ml-1 text-text-brand">*</span>}
      </span>
      {control}
    </label>
  );
}

export default function CreateProductAttributes({
  categoryTitle,
  attributes,
  values,
  onChange,
}: CreateProductAttributesProps) {
  return (
    <div className="rounded-xl bg-[#fafbfc] p-4 sm:p-5">
      <p className="mb-4 text-sm font-medium">
        Характеристики <span className="text-xs font-normal text-text-tertiary">для {categoryTitle}</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {attributes.map((attribute) => (
          <AttributeField
            key={attribute.id}
            attribute={attribute}
            value={values[attribute.id]?.[0] ?? ""}
            onChange={(value) => onChange(attribute.id, value)}
          />
        ))}
      </div>
    </div>
  );
}
