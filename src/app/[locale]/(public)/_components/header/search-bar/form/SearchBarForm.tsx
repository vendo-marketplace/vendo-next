import { Button } from "@/components/ui/button/button";
import { NavCameraIcon, NavSearchSmallIcon } from "@/assets/icons/NavIcons";
import type { SubmitEvent } from "react";

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
};

const SearchBarForm = ({ query, onQueryChange, onSubmit, autoFocus = false }: Props) => {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      className="group h-10 flex-1 flex"
      role="search"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center h-full gap-2 rounded-lg px-2.5 border border-stroke-primary-subtle bg-surface-primary shadow-xs flex-1 transition-colors group-focus-within:border-stroke-brand">
        <Button
          variant="none"
          type="submit"
          size="none"
          aria-label="Шукати"
          className="size-4 rounded-none text-text-tertiary group-focus-within:text-text-brand focus:text-text-brand hover:text-text-hover"
        >
          <NavSearchSmallIcon size={16} />
        </Button>
        <input
          name="query"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full text-sm placeholder:text-sm outline-none placeholder:text-text-placeholder"
          placeholder="Пошук товарів"
          aria-label="Пошук товарів"
          autoComplete="off"
          autoFocus={autoFocus}
        />
        <Button
          variant="none"
          size="none"
          type="button"
          aria-label="Пошук за фото"
          className="size-4 rounded-none text-text-tertiary focus:text-text-brand hover:text-text-hover"
        >
          <NavCameraIcon size={16} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBarForm;
