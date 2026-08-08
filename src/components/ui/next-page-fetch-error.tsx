import { Button } from "./button";

interface NextPageFetchErrorProps {
  onRetry: () => void;
}

export const NextPageFetchError = ({ onRetry }: NextPageFetchErrorProps) => (
  <div className="flex flex-col items-center gap-2">
    <p>Помилка при завантаженні</p>
    <Button type="button" variant="secondary" onClick={onRetry}>
      Спробувати ще раз
    </Button>
  </div>
);
