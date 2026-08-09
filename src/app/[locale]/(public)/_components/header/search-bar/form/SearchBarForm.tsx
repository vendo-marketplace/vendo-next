import { Button } from "@/components/ui/button/button";
import { CameraIcon, SearchIcon } from "@/components/ui/icons";
import type { SubmitEvent } from "react";

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
};

const SearchBarForm = ({ query, onQueryChange, onSubmit }: Props) => {
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
      <div className="flex items-center h-full gap-2 rounded-lg px-2.5 border border-neutral-300 flex-1 group-focus-within:border-brand-600">
        <Button
          variant="none"
          type="submit"
          size="none"
          className="size-4 rounded-none text-neutral-400 group-focus-within:text-brand-600 focus:text-brand-600 hover:text-brand-600"
        >
          <SearchIcon className="size-4" />
        </Button>
        <input
          name="query"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full text-sm placeholder:text-sm outline-none placeholder:text-neutral-300"
          placeholder="Пошук товарів"
          aria-label="Пошук товарів"
          autoComplete="off"
        />
        <Button
          variant="none"
          size="none"
          type="button"
          className="size-4 rounded-none text-neutral-400 focus:text-brand-600 hover:text-brand-600"
        >
          <CameraIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBarForm;
