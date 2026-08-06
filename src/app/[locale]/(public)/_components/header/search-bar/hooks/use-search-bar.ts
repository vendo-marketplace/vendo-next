import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";

export const useSearchBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState({ urlQuery, value: urlQuery });
  const query = draft.urlQuery === urlQuery ? draft.value : urlQuery;

  const setQuery = (value: string) => {
    setDraft({ urlQuery, value });
  };

  const search = () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) return;

    router.push({
      pathname: "/search",
      query: { q: normalizedQuery },
    });
  };

  return { query, setQuery, search };
};
