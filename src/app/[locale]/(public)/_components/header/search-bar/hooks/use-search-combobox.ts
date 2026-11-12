import { useId, useState, type FocusEvent, type KeyboardEvent } from "react";

import { useSearchSuggestions } from "@/features/search/hooks/use-search-suggestions";
import {
  clearSearchHistory,
  removeFromSearchHistory,
  useSearchHistory,
} from "@/features/search/lib/search-history";

type Params = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (value?: string) => void;
};

// The search field as a combobox: focus opens the dropdown (history and popular searches,
// or suggestions while typing); arrows move through the rows, Enter searches the active row,
// Escape closes it and Delete removes the active history row.
export const useSearchCombobox = ({ query, onQueryChange, onSubmit }: Params) => {
  const dropdownId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const history = useSearchHistory();
  const suggestions = useSearchSuggestions(query);
  const isTyping = query.trim().length > 0;
  const options = isTyping ? suggestions : history;
  const currentIndex = activeIndex < options.length ? activeIndex : -1;
  // Popular searches always fill the empty state; while typing it shows only with matches.
  const isExpanded = isOpen && (!isTyping || suggestions.length > 0);
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const changeQuery = (value: string) => {
    onQueryChange(value);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const select = (value: string) => {
    close();
    onSubmit(value);
  };

  const remove = (value: string) => {
    removeFromSearchHistory(value);
    setActiveIndex(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = options.length;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        if (count) setActiveIndex((currentIndex + 1) % count);
        return;
      case "ArrowUp":
        event.preventDefault();
        setIsOpen(true);
        if (count) setActiveIndex(currentIndex <= 0 ? count - 1 : currentIndex - 1);
        return;
      case "Enter": {
        const value = options[currentIndex];
        if (!isExpanded || value === undefined) return;
        event.preventDefault();
        select(value);
        return;
      }
      case "Escape":
        if (!isExpanded) return;
        // Only the dropdown closes; a second Escape can close the phone search row.
        event.stopPropagation();
        close();
        return;
      case "Delete": {
        const value = options[currentIndex];
        if (isTyping || !isExpanded || value === undefined) return;
        event.preventDefault();
        remove(value);
      }
    }
  };

  // Focus moving to the popular tags keeps it open; leaving the search area closes it.
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };

  return {
    isExpanded,
    containerProps: { onBlur },
    inputProps: {
      role: "combobox" as const,
      "aria-expanded": isExpanded,
      "aria-controls": isExpanded ? dropdownId : undefined,
      "aria-autocomplete": "list" as const,
      "aria-activedescendant": isExpanded && currentIndex >= 0 ? getOptionId(currentIndex) : undefined,
      onFocus: () => setIsOpen(true),
      onClick: () => setIsOpen(true),
      onKeyDown,
    },
    changeQuery,
    close,
    dropdownProps: {
      id: dropdownId,
      listboxId,
      query,
      options,
      activeIndex: currentIndex,
      getOptionId,
      onActiveIndexChange: setActiveIndex,
      onSelect: select,
      onFill: (value: string) => changeQuery(`${value} `),
      onRemove: remove,
      onClear: () => {
        clearSearchHistory();
        setActiveIndex(-1);
      },
    },
  };
};
