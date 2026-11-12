import { useState } from "react";

import { clearSearchPhoto } from "@/features/photo-search/lib/photo-search-store";
import { addToSearchHistory } from "@/features/search/lib/search-history";
import { useRouter } from "@/i18n/navigation";

export const useSearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Searches the typed text, or a picked history row, suggestion or popular search.
  const search = (value: string = query) => {
    const normalizedQuery = value.trim();

    if (!normalizedQuery) return;

    // A text search replaces a photo search.
    clearSearchPhoto();
    addToSearchHistory(normalizedQuery);

    router.push({
      pathname: "/search",
      query: { q: normalizedQuery },
    });
    setQuery("");
  };

  return { query, setQuery, search };
};
