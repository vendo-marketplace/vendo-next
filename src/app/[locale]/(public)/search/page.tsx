import SearchResults from "@/features/products/components/search-results/SearchResults";

interface Props {
  searchParams: Promise<{ q?: string | string[] }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const { q } = await searchParams;
  const query = String(q);
  return (
    <section className="px-20 py-6">
      <h1 className="mb-1 text-2xl font-semibold">
        {query ? `Результати пошуку для «${query}»` : "Пошук"}
      </h1>
      {query ? (
        <SearchResults query={query} />
      ) : (
        <p>Введіть пошуковий запит.</p>
      )}
    </section>
  );
};

export default SearchPage;
