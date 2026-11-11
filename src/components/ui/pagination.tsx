import { AngleLeftIcon } from "@/assets/icons/AngleLeftIcon";
import { AngleRightIcon } from "@/assets/icons/AngleRightIcon";
import { cn } from "@/utils/utils";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

// 1 … 4 5 6 … 24: first, last and the neighbours of the current page.
export const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = Math.max(2, Math.min(currentPage - 1, totalPages - 4));
  let end = Math.min(totalPages - 1, Math.max(currentPage + 1, 5));
  // An ellipsis that would hide a single page shows that page instead.
  if (start === 3) start = 2;
  if (end === totalPages - 2) end = totalPages - 1;
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return [
    1,
    ...(start > 2 ? (["ellipsis-start"] as const) : []),
    ...middle,
    ...(end < totalPages - 1 ? (["ellipsis-end"] as const) : []),
    totalPages,
  ];
};

const itemClassName =
  "flex h-11 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors sm:px-3 lg:h-9";

const navButtonClassName = cn(
  itemClassName,
  "border-stroke-primary-subtle bg-surface-primary text-text-primary hover:bg-surface-secondary disabled:cursor-not-allowed disabled:border-stroke-secondary disabled:text-text-placeholder disabled:hover:bg-surface-primary",
);

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Сторінки" className="flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
        <li>
          <button
            type="button"
            aria-label="Попередня сторінка"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={navButtonClassName}
          >
            <AngleLeftIcon size={16} />
          </button>
        </li>
        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                aria-label={`Сторінка ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={cn(
                  itemClassName,
                  item === currentPage
                    ? "border-stroke-brand-subtle bg-surface-brand-subtle text-text-brand"
                    : "border-stroke-primary-subtle bg-surface-primary text-text-primary hover:bg-surface-secondary",
                )}
              >
                {item}
              </button>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden="true"
              className={cn(itemClassName, "border-stroke-primary-subtle bg-surface-primary text-text-primary")}
            >
              …
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Наступна сторінка"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={navButtonClassName}
          >
            <AngleRightIcon size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
