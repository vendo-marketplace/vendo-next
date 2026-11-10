import { MapPin, Sparkles, UserRound } from "lucide-react";
import { Tabs } from "radix-ui";

import type { CategoryAttribute } from "@/features/categories/types/category";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";

const tabClassName =
  "whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary data-[state=active]:border-surface-brand data-[state=active]:text-text-brand sm:px-5";

type Props = {
  product: ProductCardType;
  categoryAttributes: CategoryAttribute[];
};

export default function ProductInfoTabs({
  product,
  categoryAttributes,
}: Props) {
  return (
    <>
      <div className="mt-8 overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-sm">
        <Tabs.Root defaultValue="description">
        <Tabs.List
          aria-label="Інформація про товар"
          className="flex gap-1 overflow-x-auto border-b border-stroke-secondary px-2 sm:px-4"
        >
          <Tabs.Trigger value="description" className={tabClassName}>
            Опис товару
          </Tabs.Trigger>
          <Tabs.Trigger value="specifications" className={tabClassName}>
            Характеристики
          </Tabs.Trigger>
          <Tabs.Trigger value="delivery" className={tabClassName}>
            Доставка
          </Tabs.Trigger>
          <Tabs.Trigger value="seller" className={tabClassName}>
            Про продавця
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="description" className="p-5 outline-none sm:p-8">
          <h2 className="text-lg font-semibold text-text-primary">Про товар</h2>
          <p className="mt-3 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-text-secondary">
            {product.description || "Продавець не додав опис до оголошення."}
          </p>
        </Tabs.Content>

        <Tabs.Content value="specifications" className="p-5 outline-none sm:p-8">
          <h2 className="text-lg font-semibold text-text-primary">Характеристики</h2>
          <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
            <SpecRow label="Стан" value={product.isNew ? "Новий" : "Вживаний"} />
            <SpecRow label="Кількість" value={`${product.quantity} шт.`} />
            <SpecRow label="Місто" value={product.address?.city || "Не вказано"} />
            <SpecRow label="Оголошення" value={product.active ? "Активне" : "Неактивне"} />
            {product.attributes.map((attribute, index) => (
              <SpecRow
                key={attribute.id}
                label={
                  categoryAttributes.find((item) => item.id === attribute.id)
                    ?.title ?? `Характеристика ${index + 1}`
                }
                value={attribute.values?.join(", ") || "Не вказано"}
              />
            ))}
          </dl>
        </Tabs.Content>

        <Tabs.Content value="delivery" className="p-5 outline-none sm:p-8">
          <h2 className="text-lg font-semibold text-text-primary">Передача товару</h2>
          <div className="mt-4 flex max-w-2xl gap-3 rounded-xl bg-surface-secondary p-4">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-text-brand" />
            <div>
              <p className="font-medium text-text-primary">
                {product.address?.city || "Місто не вказано"}
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Уточніть із продавцем доступні варіанти доставки або зустрічі в цьому місті.
              </p>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="seller" className="p-5 outline-none sm:p-8">
          <h2 className="text-lg font-semibold text-text-primary">Про продавця</h2>
          <div className="mt-4 flex max-w-2xl items-start gap-4 rounded-xl border border-stroke-secondary p-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-secondary text-text-brand">
              <UserRound aria-hidden="true" className="size-6" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Продавець Vendo</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Оголошення розміщено {formatRelativeTime(product.createdAt)}.
                Деталі профілю продавця поки недоступні.
              </p>
            </div>
          </div>
        </Tabs.Content>
        </Tabs.Root>
      </div>
      <p className="flex items-center gap-2 px-5 pb-5 text-xs text-text-tertiary sm:px-8">
        <Sparkles aria-hidden="true" className="size-4" />
        Кожне оголошення має власну сторінку з повною інформацією про товар.
      </p>
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-stroke-secondary py-3 text-sm">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="text-right font-medium text-text-primary">{value}</dd>
    </div>
  );
}
