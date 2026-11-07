"use client";

import { useTranslations } from "next-intl";

import Select from "@/components/ui/select/select";

import {
  PRODUCT_SORT_VALUES,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

type Props = {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  sortValues?: readonly ProductSortOption[];
};

const ProductSortSelect = ({
  value,
  onChange,
  sortValues = PRODUCT_SORT_VALUES,
}: Props) => {
  const t = useTranslations("ProductSort");
  const options = sortValues.map((sortValue) => ({
    value: sortValue,
    label: t(sortValue),
  }));

  return (
    <Select
      className="w-52!"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};

export default ProductSortSelect;
