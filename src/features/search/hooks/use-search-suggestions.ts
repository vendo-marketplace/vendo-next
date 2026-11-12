"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { productQueries } from "@/features/products/queries/product.queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { POPULAR_SEARCHES } from "../lib/popular-searches";
import { useSearchHistory } from "../lib/search-history";

const SUGGESTION_LIMIT = 6;
const MIN_QUERY_LENGTH = 2;
const PRODUCTS_TO_SCAN = 12;

const normalize = (text: string) => text.trim().toLocaleLowerCase("uk");

// Suggestions while typing (Figma 5372-18751): the user's own past searches first, then
// popular queries, then titles of listings that contain what was typed.
// TODO(api): swap the listing titles for a real autocomplete endpoint once there is one.
export const useSearchSuggestions = (query: string) => {
  const history = useSearchHistory();
  const typed = normalize(query);
  const debounced = useDebouncedValue(typed, 250);
  const { data } = useQuery({
    ...productQueries.searchPage(debounced, { page: 1, size: PRODUCTS_TO_SCAN }),
    enabled: debounced.length >= MIN_QUERY_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  return useMemo(() => {
    if (!typed) return [];
    const titles = typed.length >= MIN_QUERY_LENGTH ? (data?.data ?? []).map((card) => card.title) : [];
    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const candidate of [...history, ...POPULAR_SEARCHES, ...titles]) {
      const key = normalize(candidate);
      if (!key.includes(typed) || seen.has(key)) continue;
      seen.add(key);
      suggestions.push(candidate.trim());
      if (suggestions.length === SUGGESTION_LIMIT) break;
    }
    return suggestions;
  }, [typed, history, data]);
};
