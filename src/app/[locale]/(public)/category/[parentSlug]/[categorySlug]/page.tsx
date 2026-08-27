interface CategoryPageProps {
  params: Promise<{
    parentSlug: string;
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parentSlug, categorySlug } = await params;

  return (
    <section className="mx-auto w-full max-w-330 px-4 py-8">
      <p className="text-sm text-text-tertiary">{parentSlug}</p>
      <h1 className="mt-2 text-3xl font-semibold text-text-primary">
        {categorySlug}
      </h1>
    </section>
  );
}
