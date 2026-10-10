"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Tag,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { toast } from "sonner";

import { productsApi } from "@/api/products";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useMe } from "@/features/auth/hooks/use-me";
import type { CategoryOption } from "@/features/categories/types/category";
import CreateProductAttributes from "@/features/products/components/create-product/CreateProductAttributes";
import CreateProductCategoryPicker from "@/features/products/components/create-product/CreateProductCategoryPicker";
import CreateProductCityField from "@/features/products/components/create-product/CreateProductCityField";
import CreateProductImagesField from "@/features/products/components/create-product/CreateProductImagesField";
import CreateProductPreview from "@/features/products/components/create-product/CreateProductPreview";
import {
  findOfficialCity,
  getCategoryTrail,
  INITIAL_PRODUCT_DRAFT,
  MAX_PRODUCT_IMAGE_SIZE,
  MAX_PRODUCT_IMAGES,
  type ProductDraft,
} from "@/features/products/components/create-product/form-utils";
import { Link, useRouter } from "@/i18n/navigation";
import type { CreateProductRequest } from "@/types/product";

const subscribeToSession = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSessionSnapshot = () =>
  Boolean(localStorage.getItem("access-token") || localStorage.getItem("refresh-token"));

type CreateProductFormProps = {
  categories: CategoryOption[];
  categoryError?: string;
};

export default function CreateProductForm({
  categories,
  categoryError,
}: CreateProductFormProps) {
  const router = useRouter();
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(true);
  const [draft, setDraft] = useState<ProductDraft>(INITIAL_PRODUCT_DRAFT);
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrls = useRef<string[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const hasStoredSession = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => false,
  );
  const { data: user, isPending: authPending } = useMe(hasStoredSession);

  useEffect(
    () => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  const selectedCategoryTrail = useMemo(
    () => getCategoryTrail(categories, categoryPath),
    [categories, categoryPath],
  );
  const selectedCategory = selectedCategoryTrail.at(-1);
  const updateDraft = (field: keyof ProductDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const selectCategory = (path: string[]) => {
    setCategoryPath(path);
    setAttributes({});
    setFormError("");
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    const selectedImages = selected.filter((file) => file.type.startsWith("image/"));
    const oversized = selectedImages.some((file) => file.size > MAX_PRODUCT_IMAGE_SIZE);
    const valid = selectedImages.filter((file) => file.size <= MAX_PRODUCT_IMAGE_SIZE);
    const accepted = valid.slice(0, Math.max(0, MAX_PRODUCT_IMAGES - images.length));
    const urls = accepted.map((file) => URL.createObjectURL(file));
    previewUrls.current.push(...urls);
    setImages((current) => [...current, ...accepted]);
    setPreviews((current) => [...current, ...urls]);
    if (oversized) {
      setImageError("Кожне фото має бути менше 10 МБ.");
    } else if (accepted.length) {
      setImageError("");
    } else if (selected.length > 0 && valid.length === 0) {
      setImageError("Оберіть зображення у форматі PNG, JPG або WEBP.");
    }
  };

  const removeImage = (index: number) => {
    const previewUrl = previews[index];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    previewUrls.current = previewUrls.current.filter((url) => url !== previewUrl);
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateAttribute = (attributeId: string, value: string) => {
    setAttributes((current) => ({
      ...current,
      [attributeId]: value ? [value] : [],
    }));
  };

  const validate = () => {
    if (!images.length) {
      setImageError("Додайте щонайменше одне фото товару.");
      return false;
    }
    if (!selectedCategory) {
      setFormError("Оберіть категорію товару.");
      return false;
    }
    if (draft.title.trim().length < 2 || draft.title.trim().length > 100) {
      setFormError("Назва має містити від 2 до 100 символів.");
      return false;
    }
    if (draft.description.trim().length < 5 || draft.description.trim().length > 250) {
      setFormError("Опис має містити від 5 до 250 символів.");
      return false;
    }
    const price = Number(draft.price);
    if (draft.price === "" || price < 0 || !Number.isFinite(price)) {
      setFormError("Вкажіть коректну ціну.");
      return false;
    }
    if (!findOfficialCity(draft.city)) {
      setFormError("Оберіть місто зі списку.");
      return false;
    }
    const missingAttribute = (selectedCategory.attributes ?? []).find(
      (attribute) => attribute.required && !attributes[attribute.id]?.[0]?.trim(),
    );
    if (missingAttribute) {
      setFormError(`Заповніть обов’язкову характеристику «${missingAttribute.title}».`);
      return false;
    }
    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;
    if (!selectedCategory) return;
    const city = findOfficialCity(draft.city);
    if (!city) return;

    const request: CreateProductRequest = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      quantity: Math.max(1, Math.floor(Number(draft.quantity) || 1)),
      isNew: draft.condition === "new",
      categoryId: selectedCategory.id,
      address: { city },
      attributes: (selectedCategory.attributes ?? [])
        .filter((attribute) => attributes[attribute.id]?.length)
        .map((attribute) => ({ id: attribute.id, values: attributes[attribute.id] })),
    };

    setIsSubmitting(true);
    try {
      await productsApi.create(request, images);
      toast.success("Оголошення створено");
      router.push("/");
    } catch (error) {
      const responseMessage =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      const message =
        responseMessage ?? "Не вдалося створити оголошення. Перевірте дані та спробуйте ще раз.";
      setFormError(message);
      toast.error("Не вдалося створити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasStoredSession && authPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-secondary">
        Перевіряємо вхід…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#f7f8fa] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-stroke-primary-subtle bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-text-brand">
            <Tag aria-hidden="true" className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold">Увійдіть, щоб створити оголошення</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-secondary">
            Після входу зможете додати фото, описати товар і опублікувати його на Vendo.
          </p>
          <Button asChild className="mt-6 w-full justify-center sm:w-auto">
            <Link href="/sign-in">
              Увійти або зареєструватися
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f7f8fa] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          На головну
        </Link>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stroke-brand-subtle bg-white px-3 py-1.5 text-xs font-medium text-text-brand">
              <span className="size-1.5 rounded-full bg-surface-brand" /> Ручне створення
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-[40px]">
              Нове оголошення
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              Кілька деталей про товар — і він з’явиться на Vendo.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-white px-3.5 py-2.5 text-xs text-text-secondary shadow-sm sm:self-auto">
            <span className="flex size-7 items-center justify-center rounded-lg bg-surface-primary-subtle">
              <Check aria-hidden="true" className="size-4 text-text-success" />
            </span>
            Заповнюйте у зручному темпі
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form onSubmit={submit} className="space-y-5">
            <CreateProductImagesField
              images={images}
              previews={previews}
              error={imageError}
              onAdd={handleImages}
              onRemove={removeImage}
            />

            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-6 flex gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand">
                  <Tag aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Про товар</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Назва, категорія та головні характеристики.
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <label htmlFor="product-title" className="flex flex-col gap-2 text-sm font-medium">
                  <span className="whitespace-nowrap">
                    Назва оголошення <span className="text-text-brand">*</span>
                  </span>
                  <Input
                    id="product-title"
                    value={draft.title}
                    onChange={(event) => updateDraft("title", event.target.value)}
                    maxLength={100}
                    placeholder="Наприклад, iPhone 15 Pro 256 ГБ"
                    className="h-12 px-3.5"
                  />
                  <span className="text-right text-xs font-normal text-text-tertiary">{draft.title.length}/100</span>
                </label>
                <CreateProductCategoryPicker
                  categories={categories}
                  selectedCategory={selectedCategory}
                  selectedCategoryTrail={selectedCategoryTrail}
                  isOpen={isCategoryPickerOpen}
                  categoryError={categoryError}
                  onSelect={selectCategory}
                  onOpenChange={setIsCategoryPickerOpen}
                />
                {selectedCategory?.attributes?.length && !isCategoryPickerOpen ? (
                  <CreateProductAttributes
                    categoryTitle={selectedCategory.title}
                    attributes={selectedCategory.attributes}
                    values={attributes}
                    onChange={updateAttribute}
                  />
                ) : null}
                <label htmlFor="product-description" className="flex flex-col gap-2 text-sm font-medium">
                  <span className="whitespace-nowrap">
                    Опис <span className="text-text-brand">*</span>
                  </span>
                  <textarea
                    id="product-description"
                    value={draft.description}
                    onChange={(event) => updateDraft("description", event.target.value)}
                    maxLength={250}
                    rows={5}
                    placeholder="Розкажіть про стан, особливості та комплект товару…"
                    className="w-full resize-y rounded-xl border border-stroke-primary-subtle bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-text-placeholder focus:border-stroke-brand"
                  />
                  <span className="text-right text-xs font-normal text-text-tertiary">{draft.description.length}/250</span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-6 flex gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand">
                  <span className="text-lg font-semibold">₴</span>
                </div>
                <div>
                  <p className="font-semibold">Ціна та стан</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Вкажіть вартість і стан речі.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="product-price" className="flex flex-col gap-2 text-sm font-medium">
                  <span className="whitespace-nowrap">
                    Ціна <span className="text-text-brand">*</span>
                  </span>
                  <div className="relative">
                    <Input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price}
                      onChange={(event) => updateDraft("price", event.target.value)}
                      placeholder="0"
                      className="h-12 pr-12 text-base font-medium"
                    />
                    <span className="absolute right-4 top-3.5 text-sm text-text-tertiary">
                      ₴
                    </span>
                  </div>
                </label>
                <div className="flex flex-col gap-2 text-sm font-medium">
                  <span className="whitespace-nowrap">
                    Стан товару <span className="text-text-brand">*</span>
                  </span>
                  <div className="grid grid-cols-2 rounded-xl bg-surface-primary-subtle p-1">
                    {([
                      { value: "used", label: "Вживаний" },
                      { value: "new", label: "Новий" },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => updateDraft("condition", item.value)}
                        className={`h-10 rounded-lg text-sm transition ${
                          draft.condition === item.value
                            ? "bg-white font-medium text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label htmlFor="product-quantity" className="flex flex-col gap-2 text-sm font-medium">
                  Кількість
                  <Input
                    id="product-quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={draft.quantity}
                    onChange={(event) => updateDraft("quantity", event.target.value)}
                    className="h-12"
                  />
                </label>
              </div>
            </section>

            <CreateProductCityField
              value={draft.city}
              onChange={(city) => updateDraft("city", city)}
            />

            {formError && (
              <div
                role="alert"
                className="rounded-xl border border-stroke-error-subtle bg-surface-error-subtle px-4 py-3 text-sm text-text-error"
              >
                {formError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-stroke-primary-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Повернутися
                </Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full justify-center sm:w-auto sm:min-w-52">
                {isSubmitting ? "Публікуємо…" : "Опублікувати оголошення"}
                {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
              </Button>
            </div>
          </form>

          <CreateProductPreview draft={draft} previews={previews} />
        </div>
      </div>
    </div>
  );
}
