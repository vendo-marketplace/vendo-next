import { getCategoryOptions } from "@/features/categories/server/get-category-options";
import AutoSearchManager from "@/features/auto-search/components/AutoSearchManager";
import type { AutoSearchFormValues } from "@/features/auto-search/types/auto-search";

type AutoSearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PREFILL_KEYS = ["categoryId", "minPrice", "maxPrice", "city"] as const;

// "Стежити за пошуком" on a category page links here with its filters as query params.
const toPrefill = (
  params: Record<string, string | string[] | undefined>,
): Partial<AutoSearchFormValues> | undefined => {
  const entries = PREFILL_KEYS.flatMap((key) => {
    const value = params[key];
    return typeof value === "string" && value ? [[key, value] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
};

export default async function AutoSearchPage({ searchParams }: AutoSearchPageProps) {
  const [categoryResult, params] = await Promise.all([getCategoryOptions(), searchParams]);

  return (
    <AutoSearchManager
      categories={categoryResult.success ? categoryResult.data : []}
      categoryError={!categoryResult.success}
      prefill={toPrefill(params)}
    />
  );
}
