import { getCategoryOptions } from "@/features/categories/server/get-category-options";
import AutoSearchManager from "@/features/auto-search/components/AutoSearchManager";

export default async function AutoSearchProductsPage({
  params,
}: {
  params: Promise<{ autoSearchId: string }>;
}) {
  const [{ autoSearchId }, categoryResult] = await Promise.all([
    params,
    getCategoryOptions(),
  ]);

  return (
    <AutoSearchManager
      categories={categoryResult.success ? categoryResult.data : []}
      categoryError={!categoryResult.success}
      selectedAutoSearchId={autoSearchId}
    />
  );
}
