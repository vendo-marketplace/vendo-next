import { CameraIcon } from "@/components/ui/icons";
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
      className="group relative flex w-full max-w-157.5 min-w-45 flex-1 items-center"
      role="search"
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="group-focus-within:text-brand-600 pointer-events-auto absolute top-[11.5px] left-2.75 z-1 size-4 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-neutral-400"
        aria-label="Пошук товарів"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.66732 2.66732C4.45818 2.66732 2.66732 4.45818 2.66732 6.66732C2.66732 8.87646 4.45818 10.6673 6.66732 10.6673C8.87646 10.6673 10.6673 8.87646 10.6673 6.66732C10.6673 4.45818 8.87646 2.66732 6.66732 2.66732ZM1.33398 6.66732C1.33398 3.7218 3.7218 1.33398 6.66732 1.33398C9.61284 1.33398 12.0007 3.7218 12.0007 6.66732C12.0007 9.61284 9.61284 12.0007 6.66732 12.0007C3.7218 12.0007 1.33398 9.61284 1.33398 6.66732ZM11.1959 11.1959C11.4563 10.9356 11.8784 10.9356 12.1387 11.1959L14.4721 13.5292C14.7324 13.7896 14.7324 14.2117 14.4721 14.4721C14.2117 14.7324 13.7896 14.7324 13.5292 14.4721L11.1959 12.1387C10.9356 11.8784 10.9356 11.4563 11.1959 11.1959Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <input
        type="text"
        name="q"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Пошук товарів"
        className="group-focus-within:border-brand-600 h-10 w-full rounded-lg border border-neutral-400 py-2.5 pr-2.5 pl-8.5 text-sm text-neutral-950 transition-[border-color] duration-150 ease-[ease] outline-none placeholder:text-neutral-400"
        aria-label="Пошук товарів"
      />

      <button
        type="button"
        className="hover:text-brand-600 absolute top-1/2 right-3 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-neutral-400 transition-[color] duration-150 ease-[ease]"
        aria-label="Пошук за фото"
      >
        <CameraIcon width={16} height={16} className="block size-4" />
      </button>
    </form>
  );
};

export default SearchBarForm;
