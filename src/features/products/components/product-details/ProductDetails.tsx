"use client";

import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  PackageCheck,
  Recycle,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { categoriesApi } from "@/api/categories";
import { useMe } from "@/features/auth/hooks/use-me";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import { Link, useRouter } from "@/i18n/navigation";
import type { ProductCardType, SearchProductsQuery } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import ProductGallery from "./ProductGallery";
import ProductInfoTabs from "./ProductInfoTabs";

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
}: {
  productId: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const searchQuery = useMemo(
    () =>
      ({
        ids: [productId],
        page: 1,
        size: 1,
        sort: { sortBy: "CREATED_AT", direction: "DESC" },
      }) satisfies SearchProductsQuery,
    [productId],
  );
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useSearchProductsPage("", searchQuery);
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
        <Button asChild variant="outline" className="mx-auto mt-6">
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
  const router = useRouter();
  const { data: user } = useMe();
  const { data: categoryAttributes = [] } = useQuery({
    queryKey: ["categories", "attributes", product.categoryId],
    queryFn: async () => {
      const response = await categoriesApi.attributes(product.categoryId);
      return response.data;
    },
  });
  const attributeSpecs = product.attributes
    .map((attribute) => ({
      label:
        categoryAttributes.find((categoryAttribute) => categoryAttribute.id === attribute.id)
          ?.title,
      value: attribute.values?.filter(Boolean).join(", "),
    }))
    .filter(
      (attribute): attribute is { label: string; value: string } =>
        Boolean(attribute.label && attribute.value),
    );
  const productSpecs = [
    {
      label: "Стан",
      value: product.isNew ? "Новий" : "Вживаний",
      icon: product.isNew ? Sparkles : Recycle,
    },
    ...attributeSpecs.slice(0, 2).map((attribute) => ({
      ...attribute,
      icon: Tag,
    })),
  ];
  if (productSpecs.length < 3) {
    productSpecs.push({
      label: "Кількість",
      value: `${product.quantity} шт.`,
      icon: PackageCheck,
    });
  }
  const shareProduct = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Посилання на товар скопійовано");
    } catch {
      toast.error("Не вдалося скопіювати посилання");
    }
  };

  const openChat = (intent: "message" | "purchase" = "message") => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (user.id === product.ownerId) {
      toast.error("Не можна написати собі на власне оголошення.");
      return;
    }

    const params = new URLSearchParams({ productId: product.id });
    if (intent === "purchase") {
      params.set("firstMessage", "Вітаю! Хочу придбати цей товар.");
    }
    router.push(`/chats?${params.toString()}`);
  };

  return (
    <section className="mx-auto w-full max-w-330 px-4 py-6 sm:py-9">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:gap-8">
        <ProductGallery product={product} activeImage={activeImage} onSelectImage={onSelectImage} />

        <aside className="h-fit rounded-2xl border border-stroke-secondary bg-surface-primary p-5 shadow-sm sm:p-7 lg:sticky lg:top-24">
          <p className="text-xs text-text-tertiary">
            Опубліковано {formatPublishedDate(product.createdAt) || formatRelativeTime(product.createdAt)}
          </p>

          <div className="mt-3 flex items-start gap-3">
            <h1 className="min-w-0 flex-1 text-lg leading-snug font-medium text-text-primary sm:text-xl">
              {product.title}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                aria-label="Поділитися товаром"
                onClick={shareProduct}
                className="size-10 rounded-full border-0 bg-surface-brand-subtle p-0 text-text-brand shadow-none hover:bg-surface-brand-subtle"
              >
                <Share2 aria-hidden="true" className="size-4" />
              </Button>
              <Button
                variant="outline"
                aria-label={favorite ? "Прибрати з обраного" : "Додати в обране"}
                aria-pressed={favorite}
                disabled={favoriteDisabled}
                onClick={onToggleFavorite}
                className="size-10 rounded-full border-0 bg-surface-brand-subtle p-0 text-text-brand shadow-none hover:bg-surface-brand-subtle disabled:opacity-50"
              >
                <Heart
                  aria-hidden="true"
                  className={`size-4 ${favorite ? "fill-current text-text-error" : ""}`}
                />
              </Button>
            </div>
          </div>

          <p className="mt-5 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {formatPrice(product.price)}
          </p>

          <div className="mt-5 grid grid-cols-3 divide-x divide-stroke-secondary border-y border-stroke-secondary py-2.5">
            {productSpecs.map(({ label, value, icon: Icon }) => (
              <div key={label} className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-3">
                <p className="truncate text-[11px] text-text-tertiary sm:text-xs">{label}</p>
                <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs font-medium text-text-primary sm:text-sm">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-text-brand" />
                  <span className="truncate">{value}</span>
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {product.address?.city || "Місто не вказано"}
          </p>

          {user?.id !== product.ownerId && (
            <div className="mt-6 grid grid-cols-2 gap-3 border-b border-stroke-secondary pb-5">
              <Button
                onClick={() => openChat("purchase")}
                disabled={!product.active}
                className="h-12 w-full min-w-0 px-2 text-sm sm:px-4"
              >
                Купити
              </Button>
              <Button
                variant="outline"
                onClick={() => openChat()}
                disabled={!product.active}
                className="h-12 w-full min-w-0 px-2 text-sm sm:px-4"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                <span className="truncate">Написати продавцю</span>
              </Button>
            </div>
          )}
        </aside>
      </div>

      <ProductInfoTabs product={product} categoryAttributes={categoryAttributes} />

    </section>
  );
}
