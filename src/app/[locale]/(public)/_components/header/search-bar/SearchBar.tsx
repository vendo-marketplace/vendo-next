"use client";

import SearchBarForm from "./form/SearchBarForm";
import { useSearchBar } from "./hooks/use-search-bar";

type Props = {
  autoFocus?: boolean;
  // Called after a search is submitted, e.g. to close the phone search row.
  onSearch?: () => void;
};

const SearchBar = ({ autoFocus, onSearch }: Props) => {
  const { query, setQuery, search } = useSearchBar();

  return (
    <SearchBarForm
      query={query}
      onQueryChange={setQuery}
      onSubmit={() => {
        search();
        onSearch?.();
      }}
      autoFocus={autoFocus}
    />
  );
};

export default SearchBar;
