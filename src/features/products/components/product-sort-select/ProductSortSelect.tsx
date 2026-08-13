"use client";

import { useTranslations } from "next-intl";

import Select from "@/components/ui/select";

import {
  PRODUCT_SORT_VALUES,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

type Props = {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
};

const ProductSortSelect = ({ value, onChange }: Props) => {
  const t = useTranslations("ProductSort");
  const options = PRODUCT_SORT_VALUES.map((sortValue) => ({
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
