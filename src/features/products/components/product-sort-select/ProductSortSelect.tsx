"use client";

import { useTranslations } from "next-intl";

import { SortIcon } from "@/assets/icons/SortIcon";
import { useIsPhone } from "@/components/ui/bottom-sheet/bottom-sheet";
import Select from "@/components/ui/select/select";

import {
  PRODUCT_SORT_VALUES,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

import { ProductSortSheet } from "./ProductSortSheet";

type Props = {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  sortValues?: readonly ProductSortOption[];
  className?: string;
};

const ProductSortSelect = ({
  value,
  onChange,
  sortValues = PRODUCT_SORT_VALUES,
  className,
}: Props) => {
  const isPhone = useIsPhone();
  const t = useTranslations("ProductSort");
  const tShort = useTranslations("ProductSortShort");
  const options = sortValues.map((sortValue) => ({
    value: sortValue,
    label: t(sortValue),
    shortLabel: tShort(sortValue),
  }));

  // Phones get a bottom sheet with large rows; wider screens a dropdown.
  if (isPhone) {
    return (
      <ProductSortSheet
        className={className}
        icon={<SortIcon size={16} />}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <Select
      className={className}
      icon={<SortIcon size={16} />}
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};

export default ProductSortSelect;
