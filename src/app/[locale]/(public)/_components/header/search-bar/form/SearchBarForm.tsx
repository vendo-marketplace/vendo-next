"use client";

import { useRef, type SubmitEvent } from "react";

import {
  CloseIcon,
  NavCameraIcon,
  NavSearchSmallIcon,
} from "@/assets/icons/NavIcons";
import { Button } from "@/components/ui/button/button";
import {
  clearSearchPhoto,
  openPhotoSearch,
  usePhotoSearch,
} from "@/features/photo-search/lib/photo-search-store";
import { SearchDropdown } from "@/features/search/components/SearchDropdown";

import { useSearchCombobox } from "../hooks/use-search-combobox";

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  // Without a value it searches the typed text.
  onSubmit: (value?: string) => void;
  autoFocus?: boolean;
};

const SearchBarForm = ({
  query,
  onQueryChange,
  onSubmit,
  autoFocus = false,
}: Props) => {
  const { photoUrl } = usePhotoSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // After a search the field lets go of focus, so the dropdown stays closed.
  const submit = (value?: string) => {
    onSubmit(value);
    inputRef.current?.blur();
  };

  const combobox = useSearchCombobox({
    query,
    onQueryChange,
    onSubmit: submit,
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    combobox.close();
    submit();
  };

  return (
    <div className="relative flex flex-1" {...combobox.containerProps}>
      {/* Figma 5343-22761: the page below the header dims while the dropdown is open
          (phones get a full-screen dropdown instead). */}
      {combobox.isExpanded && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-16 bottom-0 animate-in bg-black/25 fade-in-0 max-md:hidden lg:top-19"
        />
      )}
      <form
        className="group flex h-10 flex-1"
        role="search"
        onSubmit={handleSubmit}
      >
        <div className="flex h-full flex-1 items-center gap-2 rounded-lg border border-stroke-primary-subtle bg-surface-primary px-2.5 shadow-xs transition-[border-color,box-shadow] group-focus-within:border-stroke-brand group-focus-within:shadow-focus-input">
          {photoUrl ? (
            // Figma 5129-28170: while searching by photo, its thumbnail sits in the field.
            <span className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-stroke-secondary py-0.5 pr-1.5 pl-0.5 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL */}
              <img
                src={photoUrl}
                alt="Фото, за яким шукаємо"
                className="h-7 w-8 rounded-md object-cover"
              />
              <button
                type="button"
                aria-label="Прибрати фото з пошуку"
                onClick={clearSearchPhoto}
                className="relative flex size-4 items-center justify-center text-text-secondary transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-text-primary"
              >
                <CloseIcon size={16} />
              </button>
            </span>
          ) : (
            <Button
              variant="none"
              type="submit"
              size="none"
              aria-label="Шукати"
              data-search-submit
              className="size-4 rounded-none text-text-tertiary group-focus-within:text-text-brand md:size-5 [&_svg]:size-full hover:text-text-hover focus:text-text-brand"
            >
              <NavSearchSmallIcon size={16} />
            </Button>
          )}
          <input
            ref={inputRef}
            name="query"
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => combobox.changeQuery(e.target.value)}
            {...combobox.inputProps}
            className="w-full min-w-0 text-sm outline-none placeholder:text-sm placeholder:text-text-placeholder [&::-webkit-search-cancel-button]:hidden"
            placeholder="я шукаю..."
            aria-label="Пошук товарів"
            autoComplete="off"
            autoFocus={autoFocus}
          />
          <Button
            variant="none"
            size="none"
            type="button"
            aria-label="Пошук за фото"
            data-photo-trigger
            aria-haspopup="dialog"
            onClick={openPhotoSearch}
            className="relative size-4 rounded-none text-text-tertiary md:size-5 [&_svg]:size-full after:absolute after:-inset-2 after:content-[''] hover:text-text-hover focus:text-text-brand"
          >
            <NavCameraIcon size={16} />
          </Button>
        </div>
      </form>
      {combobox.isExpanded && <SearchDropdown {...combobox.dropdownProps} />}
    </div>
  );
};

export default SearchBarForm;
