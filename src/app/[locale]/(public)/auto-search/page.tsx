import { getCategoryOptions } from "@/features/categories/server/get-category-options";
import AutoSearchManager from "@/features/auto-search/components/AutoSearchManager";

export default async function AutoSearchPage() {
  const categoryResult = await getCategoryOptions();

  return (
    <AutoSearchManager
      categories={categoryResult.success ? categoryResult.data : []}
      categoryError={!categoryResult.success}
    />
  );
}
