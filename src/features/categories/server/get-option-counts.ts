import { apiEndpoints } from "@/api/endpoints";
import { getApiUrl } from "@/api/get-api-url";

const COUNTS_REVALIDATE_SECONDS = 60;

const countListings = async (categoryId: string, attributeId: string, value: string) => {
  const response = await fetch(getApiUrl(apiEndpoints.products.search), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoryId,
      page: 1,
      size: 1,
      attributeFilter: { attributes: [{ id: attributeId, values: [value] }] },
    }),
    next: { revalidate: COUNTS_REVALIDATE_SECONDS },
  });
  if (!response.ok) return undefined;

  const { metadata } = (await response.json()) as { metadata?: { totalElements?: number } };
  return metadata?.totalElements;
};

// Listings per option across the whole category (other active filters are not applied).
// TODO(api): replace the request-per-option with facet counts once /search returns them.
export const getOptionCounts = async (
  categoryId: string,
  attributeId: string,
  options: string[],
): Promise<Record<string, number> | undefined> => {
  try {
    const counts = await Promise.all(
      options.map((option) => countListings(categoryId, attributeId, option)),
    );
    return Object.fromEntries(
      options.flatMap((option, index) => {
        const count = counts[index];
        return count === undefined ? [] : [[option, count]];
      }),
    );
  } catch {
    // Counts are a hint; the filter still works without them.
    return undefined;
  }
};
