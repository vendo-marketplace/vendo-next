"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Tabs } from "radix-ui";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { categoriesApi } from "@/api/categories";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import { Link } from "@/i18n/navigation";
import type { ProductCardType, SearchProductsQuery } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";

const tabsClassName =
  "whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary data-[state=active]:border-surface-brand data-[state=active]:text-text-brand sm:px-5";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(price);

const formatPublishedDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("uk-UA", {
        day: "numeric",
        month: "long",
      }).format(date);
};

export default function ProductDetails({
  productId,
  searchTerm,
}: {
  productId: string;
  searchTerm: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const searchQuery = useMemo(
    () =>
      ({
        page: 1,
        size: 30,
        sort: { sortBy: "CREATED_AT", direction: "DESC" },
      }) satisfies SearchProductsQuery,
    [],
  );
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useSearchProductsPage(
    searchTerm,
    searchQuery,
    Boolean(searchTerm),
  );
  const product = searchResults?.data.find((item) => item.id === productId);
  const {
    favoriteIds,
    isLoading: favoritesLoading,
    isFavoritePending,
    toggleFavorite,
  } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <section className="mx-auto grid min-h-[55vh] w-full max-w-330 place-content-center px-4 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-secondary text-text-brand">
          <PackageCheck aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-text-primary">
          Товар не знайдено
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
          Можливо, оголошення вже видалили або воно більше не доступне.
        </p>
        {isError && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 text-sm font-medium text-text-brand hover:underline"
          >
            Спробувати ще раз
          </button>
        )}
        <Button asChild variant="secondary" className="mx-auto mt-6">
          <Link href="/">
            <ArrowLeft aria-hidden="true" className="size-4" />
            До каталогу
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <ProductPageContent
      product={product}
      activeImage={activeImage}
      onSelectImage={setActiveImage}
      favorite={favoriteIds.has(product.id)}
      favoriteDisabled={favoritesLoading || isFavoritePending(product.id)}
      onToggleFavorite={() => toggleFavorite(product)}
    />
  );
}

function ProductPageContent({
  product,
  activeImage,
  onSelectImage,
  favorite,
  favoriteDisabled,
  onToggleFavorite,
}: {
  product: ProductCardType;
  activeImage: number;
  onSelectImage: (index: number) => void;
  favorite: boolean;
  favoriteDisabled: boolean;
  onToggleFavorite: () => void;
}) {
  const images = product.images.filter(Boolean);
  const image = images[activeImage] ?? images[0];
  const { data: categoryAttributes = [] } = useQuery({
    queryKey: ["categories", "attributes", product.categoryId],
    queryFn: async () => {
      const response = await categoriesApi.attributes(product.categoryId);
      return response.data;
    },
  });
  const shareProduct = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Посилання на товар скопійовано");
    } catch {
      toast.error("Не вдалося скопіювати посилання");
    }
  };

  return (
    <section className="mx-auto w-full max-w-330 px-4 py-6 sm:py-9">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:gap-8">
        <div className="min-w-0">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-[0_2px_12px_rgba(20,31,54,0.04)] sm:aspect-[16/11]">
            {image ? (
              <Image
                src={image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-contain p-3 sm:p-6"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-text-tertiary">
                Фото товару відсутнє
              </div>
            )}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge theme={product.isNew ? "brand" : "gray"} size="lg">
                {product.isNew ? "Новий" : "Вживаний"}
              </Badge>
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Попереднє фото"
                  onClick={() =>
                    onSelectImage((activeImage - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-stroke-secondary bg-white/90 text-text-primary shadow-sm transition hover:bg-white"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Наступне фото"
                  onClick={() => onSelectImage((activeImage + 1) % images.length)}
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-stroke-secondary bg-white/90 text-text-primary shadow-sm transition hover:bg-white"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  aria-label={`Показати фото ${index + 1}`}
                  aria-pressed={activeImage === index}
                  onClick={() => onSelectImage(index)}
                  className={`relative size-20 shrink-0 overflow-hidden rounded-xl border bg-surface-primary transition ${
                    activeImage === index
                      ? "border-2 border-stroke-brand"
                      : "border-stroke-secondary hover:border-stroke-brand"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-stroke-secondary bg-surface-primary p-5 shadow-[0_2px_12px_rgba(20,31,54,0.04)] sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 text-xs text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-4" />
              {product.address?.city || "Місто не вказано"}
            </span>
            <span>
              {formatPublishedDate(product.createdAt)
                ? `Опубліковано ${formatPublishedDate(product.createdAt)}`
                : formatRelativeTime(product.createdAt)}
            </span>
          </div>
          <h1 className="mt-4 text-lg leading-snug font-medium text-text-primary sm:text-xl">
            {product.title}
          </h1>
          <p className="mt-3 text-xl font-medium tracking-tight text-text-primary sm:text-2xl">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              disabled={favoriteDisabled}
              variant={favorite ? "secondary" : "brand"}
              onClick={onToggleFavorite}
              className="w-full"
            >
              <Heart
                aria-hidden="true"
                className={`size-4 ${favorite ? "fill-current text-text-error" : ""}`}
              />
              {favorite ? "В обраному" : "В обране"}
            </Button>
            <Button variant="secondary" onClick={shareProduct} className="w-full">
              <Copy aria-hidden="true" className="size-4" />
              Поділитися
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-stroke-secondary pt-5">
            <QuickFact
              icon={<PackageCheck aria-hidden="true" className="size-4" />}
              label="Кількість"
              value={`${product.quantity} шт.`}
            />
            <QuickFact
              icon={<CalendarDays aria-hidden="true" className="size-4" />}
              label="Опубліковано"
              value={formatRelativeTime(product.createdAt)}
            />
          </div>

          <div className="mt-5 flex gap-3 rounded-xl bg-surface-secondary p-4">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-text-brand" />
            <p className="text-xs leading-5 text-text-secondary">
              Перевірте стан товару та узгодьте зручний спосіб передачі з продавцем.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-[0_2px_12px_rgba(20,31,54,0.04)]">
        <Tabs.Root defaultValue="description">
          <Tabs.List
            aria-label="Інформація про товар"
            className="flex gap-1 overflow-x-auto border-b border-stroke-secondary px-2 sm:px-4"
          >
            <Tabs.Trigger value="description" className={tabsClassName}>
              Опис товару
            </Tabs.Trigger>
            <Tabs.Trigger value="specifications" className={tabsClassName}>
              Характеристики
            </Tabs.Trigger>
            <Tabs.Trigger value="delivery" className={tabsClassName}>
              Доставка
            </Tabs.Trigger>
            <Tabs.Trigger value="seller" className={tabsClassName}>
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

      <div className="mt-5 flex items-center gap-2 text-xs text-text-tertiary">
        <Sparkles aria-hidden="true" className="size-4" />
        Кожне оголошення має власну сторінку з повною інформацією про товар.
      </div>
    </section>
  );
}

function QuickFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-medium text-text-primary">{value}</p>
    </div>
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
