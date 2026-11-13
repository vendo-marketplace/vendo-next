"use client";

import { ArrowRightIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Pagination } from "@/components/ui/pagination";

import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import { SavedSearchCard } from "../home-mascot/SavedSearchCard";
import { getDemoFeed, isDemoFeedOn } from "./demo-feed";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import { getProductSortQuery } from "@/features/products/lib/product-sort";
import { Link } from "@/i18n/navigation";
import type { SearchProductsQuery } from "@/types/product";

const PAGE_SIZE = 30;

// The homepage feed: the newest listings as compact cards, with paging.
export default function RecommendedProducts() {
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const productsQuery = useMemo(
    (): SearchProductsQuery => ({
      page,
      size: PAGE_SIZE,
      sort: getProductSortQuery("CREATED_AT_DESC"),
    }),
    [page],
  );
  const { data, isFetching, isLoading } = useSearchProductsPage(
    "",
    productsQuery,
  );

  // Locally, a demo feed with real-looking photos can stand in for the test listings.
  const demoCards = useMemo(() => (isDemoFeedOn ? getDemoFeed() : []), []);
  const cards = isDemoFeedOn ? demoCards : (data?.data ?? []);
  const pagination = data?.metadata;

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!isLoading && cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="page-container relative z-10 scroll-mt-18 space-y-4 pt-4 lg:space-y-4 lg:pt-4 md:scroll-mt-20 lg:scroll-mt-23"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-lg font-bold text-text-primary lg:text-xl">
          Нові оголошення
        </h2>
        <Link
          href="/search"
          className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-text-brand hover:text-text-brand-dark"
        >
          Дивитись усі
          <ArrowRightIcon
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <ProductCardsGrid
        cards={cards}
        isLoading={!isDemoFeedOn && (isLoading || isFetching)}
        dense
        // After six cards the mascot offers help; six fills whole rows at 2, 3, 4 and 5 columns.
        insert={
          page === 1 ? { index: 6, node: <SavedSearchCard /> } : undefined
        }
      />
      {pagination && !isDemoFeedOn && (
        <Pagination
          label="Сторінки рекомендованих товарів"
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}
    </section>
  );
}
