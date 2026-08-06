"use client";

import SearchBarForm from "./form/SearchBarForm";
import { useSearchBar } from "./hooks/use-search-bar";

const SearchBar = () => {
  const { initialQuery, search } = useSearchBar();

  return (
    <SearchBarForm
      key={initialQuery}
      initialQuery={initialQuery}
      onSubmit={search}
    />
  );
};

export default SearchBar;
