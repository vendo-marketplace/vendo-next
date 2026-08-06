import { Button } from "@/components/ui/button";
import type { SubmitEvent } from "react";

type Props = {
  initialQuery: string;
  onSubmit: (query: string) => void;
};

const SearchBarForm = ({ initialQuery, onSubmit }: Props) => {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    onSubmit(String(formData.get("q") ?? ""));
  };

  return (
    <form className="flex" role="search" onSubmit={handleSubmit}>
      <label htmlFor="header-search" className="sr-only">
        Label
      </label>
      <input
        id="header-search"
        name="q"
        type="search"
        defaultValue={initialQuery}
        placeholder={"Search"}
        className="border-border-base h-12 min-w-80 rounded-l-lg border bg-white px-4 outline-none focus:border-brand-600"
      />
      <Button type="submit" className="rounded-l-none px-6">
        Submit
      </Button>
    </form>
  );
};

export default SearchBarForm;
