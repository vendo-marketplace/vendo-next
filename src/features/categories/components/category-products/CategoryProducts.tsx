"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import type {
  AttributeValueFilter,
  SearchProductsQuery,
} from "@/types/product";
import type { CategoryAttribute } from "../../types/category";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NumberInput from "@/components/ui/input/number-input";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import CityAutocompleteInput from "@/features/products/components/CityAutocompleteInput";
import { findOfficialCity } from "@/features/products/components/create-product/form-utils";
import {
  DEFAULT_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

type AttributeValue = {
  values: string[];
  min: string;
  max: string;
};

const initialAttributeValue: AttributeValue = {
  values: [],
  min: "",
  max: "",
};

const filterLabelClassName =
  "text-sm font-medium leading-5 text-text-primary";

function AttributeControl({
  attribute,
  value,
  onChange,
}: {
  attribute: CategoryAttribute;
  value: AttributeValue;
  onChange: (value: AttributeValue) => void;
}) {
  if (attribute.type === "ENUM") {
    return (
      <fieldset className="grid gap-2">
        <legend className={filterLabelClassName}>
          {attribute.title}
        </legend>
        {(attribute.allowedValues ?? []).map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm leading-5 text-text-secondary">
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
      <label className={`grid gap-2 ${filterLabelClassName}`}>
        {attribute.title}
        <select
          className="h-10 rounded-lg border border-stroke-primary bg-surface-primary px-3 text-sm font-normal"
          value={value.values[0] ?? ""}
          onChange={(event) =>
            onChange({ ...value, values: event.target.value ? [event.target.value] : [] })
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
        <legend className={filterLabelClassName}>
          {attribute.title}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            containerClassName="h-10 min-w-0 rounded-lg px-2"
            value={value.min}
            onValueChange={(min) => onChange({ ...value, min })}
            placeholder="Від"
            aria-label={`${attribute.title}: від`}
          />
          <NumberInput
            containerClassName="h-10 min-w-0 rounded-lg px-2"
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
    return (
      <div className={`grid gap-2 ${filterLabelClassName}`}>
        <label htmlFor={`filter-${attribute.id}`}>{attribute.title}</label>
        <NumberInput
          id={`filter-${attribute.id}`}
          containerClassName="h-10 rounded-lg px-2"
          value={value.min}
          onValueChange={(min) => onChange({ ...value, min })}
          placeholder="Значення"
        />
      </div>
    );
  }

  return null;
}

function toAttributeFilters(
  attributes: CategoryAttribute[],
  values: Record<string, AttributeValue>,
): AttributeValueFilter[] {
  return attributes.flatMap((attribute) => {
    const value = values[attribute.id] ?? initialAttributeValue;
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

export default function CategoryProducts({
  categoryId,
  attributes,
}: {
  categoryId: string;
  attributes: CategoryAttribute[];
}) {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_PRODUCT_SORT);
  const [isNew, setIsNew] = useState(false);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [attributeValues, setAttributeValues] = useState<
    Record<string, AttributeValue>
  >({});
  const [appliedFilters, setAppliedFilters] = useState<{
    isNew: boolean;
    minimumPrice: string;
    maximumPrice: string;
    city: string;
    attributes: Record<string, AttributeValue>;
  }>({ isNew: false, minimumPrice: "", maximumPrice: "", city: "", attributes: {} });
  const { ref, inView } = useInView({ rootMargin: "300px" });

  const query = useMemo<SearchProductsQuery>(() => {
    const min = appliedFilters.minimumPrice
      ? Number(appliedFilters.minimumPrice)
      : undefined;
    const max = appliedFilters.maximumPrice
      ? Number(appliedFilters.maximumPrice)
      : undefined;
    const attributeFilters = toAttributeFilters(attributes, appliedFilters.attributes);

    return {
      categoryId,
      active: true,
      ...(appliedFilters.isNew ? { isNew: true } : {}),
      sort: getProductSortQuery(sort),
      ...(appliedFilters.city ? { addressFilter: { city: appliedFilters.city } } : {}),
      ...(min !== undefined || max !== undefined
        ? { priceRangeFilter: { minPrice: min, maxPrice: max } }
        : {}),
      ...(attributeFilters.length
        ? { attributeFilter: { attributes: attributeFilters } }
        : {}),
      page: 1,
      size: 20,
    };
  }, [appliedFilters, attributes, categoryId, sort]);

  const productsQuery = useSearchProducts("", query);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = productsQuery;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchNextPageError, isFetchingNextPage]);

  const cards = data?.pages.flatMap((page) => page.data) ?? [];
  const totalElements = data?.pages[0].metadata.totalElements;

  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const selectedCity = city.trim() ? findOfficialCity(city) : undefined;
          if (city.trim() && !selectedCity) {
            setCityError("Оберіть місто зі списку.");
            return;
          }
          setCityError("");
          setAppliedFilters({
            isNew,
            minimumPrice,
            maximumPrice,
            city: selectedCity ?? "",
            attributes: attributeValues,
          });
        }}
        className="grid gap-5 rounded-xl border border-stroke-secondary bg-surface-primary p-5 lg:sticky lg:top-24"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-text-primary">Фільтри</h2>
          <button
            type="button"
            aria-expanded={isFiltersOpen}
            aria-controls="category-filter-controls"
            onClick={() => setIsFiltersOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
          >
            {isFiltersOpen ? "Згорнути" : "Показати фільтри"}
            <ChevronDown
              aria-hidden="true"
              className={`size-4 transition-transform duration-200 ${isFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isFiltersOpen && (
          <div
            id="category-filter-controls"
            className="grid grid-cols-1 items-start gap-5"
          >
            <fieldset className="grid gap-2">
              <legend className={filterLabelClassName}>Ціна</legend>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  containerClassName="h-10 min-w-0 rounded-lg px-2"
                  min="0"
                  value={minimumPrice}
                  onValueChange={setMinimumPrice}
                  placeholder="Від"
                  aria-label="Ціна від"
                />
                <NumberInput
                  containerClassName="h-10 min-w-0 rounded-lg px-2"
                  min="0"
                  value={maximumPrice}
                  onValueChange={setMaximumPrice}
                  placeholder="До"
                  aria-label="Ціна до"
                />
              </div>
            </fieldset>
            <div>
              <CityAutocompleteInput
                id="category-filter-city"
                label="Місто"
                value={city}
                onChange={(value) => {
                  setCity(value);
                  setCityError("");
                }}
                placeholder="Наприклад, Київ"
              />
              {cityError && <p role="alert" className="mt-1.5 text-xs text-text-error">{cityError}</p>}
            </div>
            <label className="flex items-center gap-2 pt-7 text-sm leading-5 text-text-secondary">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(event) => setIsNew(event.target.checked)}
                className="size-4 accent-surface-brand"
              />
              Нові товари
            </label>
            {attributes
              .filter((attribute) => attribute.type !== "STRING")
              .map((attribute) => (
                <AttributeControl
                  key={attribute.id}
                  attribute={attribute}
                  value={attributeValues[attribute.id] ?? initialAttributeValue}
                  onChange={(value) =>
                    setAttributeValues((current) => ({
                      ...current,
                      [attribute.id]: value,
                    }))
                  }
                />
              ))}
          </div>
        )}

        {isFiltersOpen && (
          <div className="flex flex-wrap items-center gap-3 border-t border-stroke-secondary pt-4">
            <button
              type="submit"
              className="h-11 rounded-lg bg-surface-brand px-5 text-sm font-semibold text-text-invert hover:bg-surface-hover"
            >
              Показати товари
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              onClick={() => {
                setIsNew(false);
                setMinimumPrice("");
                setMaximumPrice("");
                setCity("");
                setCityError("");
                setAttributeValues({});
                setAppliedFilters({
                  isNew: false,
                  minimumPrice: "",
                  maximumPrice: "",
                  city: "",
                  attributes: {},
                });
              }}
            >
              Очистити фільтри
            </button>
          </div>
        )}
      </form>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            {totalElements !== undefined && (
              <p className="text-sm text-text-secondary">
                Знайдено товарів: {totalElements}
              </p>
            )}
          </div>
          <ProductSortSelect value={sort} onChange={setSort} />
        </div>
        {isError && !data ? (
          <p className="text-sm text-text-secondary">Не вдалося завантажити товари.</p>
        ) : totalElements === 0 ? (
          <p className="py-12 text-center text-text-secondary">
            За цими фільтрами товарів не знайдено.
          </p>
        ) : (
          <ProductCardsGrid cards={cards} isLoading={isLoading} />
        )}
        <div ref={ref} className="h-px" aria-hidden="true" />
        {isFetchingNextPage && <LoadingSpinner />}
        {isFetchNextPageError && (
          <NextPageFetchError onRetry={() => void fetchNextPage()} />
        )}
      </div>
    </div>
  );
}
