import Select from "@/components/ui/select";

import {
  PRODUCT_SORT_OPTIONS,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

type Props = {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
};

const ProductSortSelect = ({ value, onChange }: Props) => (
  <Select
    options={PRODUCT_SORT_OPTIONS}
    value={value}
    onChange={onChange}
  />
);

export default ProductSortSelect;
