"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { formatListingsCount } from "../category-filters/lib/filter-display";

type ListingsCountContextValue = {
  count?: number;
  setCount: (count: number | undefined) => void;
};

const ListingsCountContext = createContext<ListingsCountContextValue | null>(null);

// The listing count is known in the products list, but phones and tablets show it next to the
// page title, so the two share it through this provider.
export function ListingsCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number>();
  return (
    <ListingsCountContext.Provider value={{ count, setCount }}>
      {children}
    </ListingsCountContext.Provider>
  );
}

export const useReportListingsCount = (count: number | undefined) => {
  const context = useContext(ListingsCountContext);
  const setCount = context?.setCount;
  useEffect(() => {
    setCount?.(count);
  }, [count, setCount]);
};

// "30 оголошень" after the title on phones and tablets; desktop keeps "Знайдено…" by the sort.
// Screen readers get the count from the toolbar's live region, so this copy is hidden from them.
export function ListingsCountNextToTitle() {
  const count = useContext(ListingsCountContext)?.count;
  if (count === undefined) return null;
  return (
    <span aria-hidden="true" className="text-xs font-medium text-text-tertiary md:text-sm lg:hidden">
      {formatListingsCount(count)}
    </span>
  );
}
