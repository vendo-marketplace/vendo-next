import { Button } from "@/components/ui/button/button";

export function CategoryEmptyResults({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-stroke-secondary bg-surface-primary px-6 py-16 text-center">
      <h2 className="text-xl font-semibold text-text-primary">Нічого не знайдено</h2>
      <p className="max-w-sm text-sm text-text-secondary">
        {hasFilters
          ? "Спробуйте змінити або скинути фільтри."
          : "У цій категорії поки немає оголошень."}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={onReset}>
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
