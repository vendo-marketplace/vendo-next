"use client";

import SearchBarForm from "./form/SearchBarForm";
import { useSearchBar } from "./hooks/use-search-bar";

const SearchBar = () => {
  const { query, setQuery, search } = useSearchBar();

  return (
    <SearchBarForm
      query={query}
      onQueryChange={setQuery}
      onSubmit={search}
    />
  );
};

export default SearchBar;
