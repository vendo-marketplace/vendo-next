import { useState } from "react";

import { useRouter } from "@/i18n/navigation";

export const useSearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) return;

    router.push({
      pathname: "/search",
      query: { q: normalizedQuery },
    });
    setQuery("");
  };

  return { query, setQuery, search };
};
