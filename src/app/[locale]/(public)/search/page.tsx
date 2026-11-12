import SearchResults from "@/features/products/components/search-results/SearchResults";
import { Suspense } from "react";

const SearchPage = async () => {
  return (
    <section className="page-container py-6">
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </section>
  );
};

export default SearchPage;
