import { getCategoryOptions } from "@/features/categories/server/get-category-options";
import CreateProductForm from "@/features/products/components/create-product/CreateProductForm";

export default async function CreateProductPage() {
  const result = await getCategoryOptions();

  return (
    <CreateProductForm
      categories={result.success ? result.data : []}
      categoryError={result.success ? undefined : result.errorMessage}
    />
  );
}
