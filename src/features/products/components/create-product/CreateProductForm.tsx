"use client";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ImagePlus,
  MapPin,
  Search,
  Sparkles,
  Tag,
  WandSparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Link, useRouter } from "@/i18n/navigation";
import { productsApi } from "@/api/products";
import { useMe } from "@/features/auth/hooks/use-me";
import type { CategoryAttribute, CategoryOption } from "@/features/categories/types/category";
import type { CreateProductRequest } from "@/types/product";

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const subscribeToSession = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSessionSnapshot = () =>
  Boolean(localStorage.getItem("access-token") || localStorage.getItem("refresh-token"));

type Draft = {
  title: string;
  description: string;
  price: string;
  quantity: string;
  condition: "new" | "used";
  city: string;
  region: string;
  lat: string;
  lon: string;
};

const initialDraft: Draft = {
  title: "",
  description: "",
  price: "",
  quantity: "1",
  condition: "used",
  city: "",
  region: "",
  lat: "",
  lon: "",
};

const formatPrice = (value: string) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0
    ? new Intl.NumberFormat("uk-UA").format(amount)
    : "0";
};

function getCategoryTrail(categories: CategoryOption[], ids: string[]): CategoryOption[] {
  let level = categories;
  const trail: CategoryOption[] = [];
  for (const id of ids) {
    const selected = level.find((category) => category.id === id);
    if (!selected) break;
    trail.push(selected);
    level = selected.children;
  }
  return trail;
}

function findCategoryPath(categories: CategoryOption[], ids: string[]): CategoryOption | undefined {
  const trail = getCategoryTrail(categories, ids);
  return trail[trail.length - 1];
}

export default function CreateProductForm({
  categories,
  categoryError,
}: {
  categories: CategoryOption[];
  categoryError?: string;
}) {
  const router = useRouter();
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [browsePath, setBrowsePath] = useState<string[]>([]);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrls = useRef<string[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string[]>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const hasStoredSession = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => false,
  );
  const { data: user, isPending: authPending } = useMe(hasStoredSession);

  useEffect(() => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const selectedCategory = useMemo(
    () => findCategoryPath(categories, categoryPath),
    [categories, categoryPath],
  );
  const selectedCategoryTrail = useMemo(
    () => getCategoryTrail(categories, categoryPath),
    [categories, categoryPath],
  );
  const browseBreadcrumbs = useMemo(() => {
    const breadcrumbs: CategoryOption[] = [];
    let current = categories;
    for (const id of browsePath) {
      const selected = current.find((item) => item.id === id);
      if (!selected) break;
      breadcrumbs.push(selected);
      current = selected.children;
    }
    return breadcrumbs;
  }, [categories, browsePath]);

  const categoriesAtLevel = browseBreadcrumbs.length
    ? browseBreadcrumbs[browseBreadcrumbs.length - 1].children
    : categories;
  const filteredCategories = categoriesAtLevel.filter((category) =>
    category.title.toLocaleLowerCase("uk").includes(categorySearch.trim().toLocaleLowerCase("uk")),
  );

  const updateDraft = (field: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const browseCategory = (category: CategoryOption) => {
    if (category.children.length) {
      setBrowsePath((current) => [...current, category.id]);
      setCategorySearch("");
      return;
    }
    setCategoryPath([...browsePath, category.id]);
    setAttributes({});
    setFormError("");
    setIsCategoryPickerOpen(false);
  };

  const reopenCategoryPicker = () => {
    setBrowsePath([]);
    setCategorySearch("");
    setIsCategoryPickerOpen(true);
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    const valid: File[] = [];
    let oversized = false;
    for (const file of selected) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_IMAGE_SIZE) {
        oversized = true;
        continue;
      }
      valid.push(file);
    }
    const accepted = valid.slice(0, Math.max(0, MAX_IMAGES - images.length));
    const urls = accepted.map((file) => URL.createObjectURL(file));
    previewUrls.current.push(...urls);
    setImages((current) => [...current, ...accepted]);
    setPreviews((current) => [...current, ...urls]);
    if (oversized) setImageError("Кожне фото має бути менше 10 МБ.");
    else if (accepted.length) setImageError("");
    else if (selected.length && valid.length === 0) setImageError("Оберіть зображення у форматі PNG, JPG або WEBP.");
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Браузер не підтримує визначення місця.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDraft((current) => ({
          ...current,
          lat: coords.latitude.toFixed(6),
          lon: coords.longitude.toFixed(6),
        }));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        toast.error("Не вдалося визначити координати. Введіть їх вручну.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const setAttributeValue = (attribute: CategoryAttribute, value: string) => {
    setAttributes((current) => ({ ...current, [attribute.id]: value ? [value] : [] }));
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
    if (draft.price === "" || Number(draft.price) < 0 || !Number.isFinite(Number(draft.price))) {
      setFormError("Вкажіть коректну ціну.");
      return false;
    }
    const latitude = Number(draft.lat);
    const longitude = Number(draft.lon);
    if (
      !draft.city.trim() ||
      !draft.region.trim() ||
      !draft.lat ||
      !draft.lon ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setFormError("Заповніть місто, область і координати місця.");
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

    const request: CreateProductRequest = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      quantity: Math.max(1, Math.floor(Number(draft.quantity) || 1)),
      isNew: draft.condition === "new",
      categoryId: selectedCategory.id,
      address: {
        city: draft.city.trim(),
        region: draft.region.trim(),
        location: { lat: Number(draft.lat), lon: Number(draft.lon) },
      },
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
      const message =
        typeof error === "object" && error && "response" in error
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Не вдалося створити оголошення. Перевірте дані та спробуйте ще раз.")
          : "Не вдалося створити оголошення. Перевірте дані та спробуйте ще раз.";
      setFormError(message);
      toast.error("Не вдалося створити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAttribute = (attribute: CategoryAttribute) => {
    const id = `attribute-${attribute.id}`;
    const value = attributes[attribute.id]?.[0] ?? "";
    const controlClass = "h-11 w-full rounded-xl border border-stroke-primary-subtle bg-white px-3.5 text-sm outline-none transition focus:border-stroke-brand";
    return (
      <label key={attribute.id} htmlFor={id} className="flex flex-col gap-2 text-sm font-medium">
        <span>{attribute.title}{attribute.required && <span className="ml-1 text-text-brand">*</span>}</span>
        {attribute.type === "ENUM" ? (
          <div className="relative">
            <select id={id} required={attribute.required} value={value} onChange={(event) => setAttributeValue(attribute, event.target.value)} className={`${controlClass} appearance-none pr-10`}>
              <option value="">Оберіть значення</option>
              {(attribute.allowedValues ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-text-tertiary" />
          </div>
        ) : attribute.type === "BOOLEAN" ? (
          <div className="relative"><select id={id} required={attribute.required} value={value} onChange={(event) => setAttributeValue(attribute, event.target.value)} className={`${controlClass} appearance-none pr-10`}><option value="">Оберіть значення</option><option value="true">Так</option><option value="false">Ні</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-text-tertiary" /></div>
        ) : (
          <Input id={id} type={attribute.type === "NUMBER" ? "number" : "text"} value={value} onChange={(event) => setAttributeValue(attribute, event.target.value)} required={attribute.required} placeholder={attribute.type === "RANGE" ? "Наприклад: 10–20" : `Вкажіть ${attribute.title.toLowerCase()}`} className="h-11 px-3.5" />
        )}
      </label>
    );
  };

  if (hasStoredSession && authPending) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-secondary">Перевіряємо вхід…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#f7f8fa] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-stroke-primary-subtle bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#edf4ff] text-text-brand"><Tag className="size-6" /></div>
          <h1 className="text-2xl font-semibold">Увійдіть, щоб створити оголошення</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-secondary">Після входу зможете додати фото, описати товар і опублікувати його на Vendo.</p>
          <Button asChild className="mt-6 w-full justify-center sm:w-auto"><Link href="/sign-in">Увійти або зареєструватися<ArrowRight className="size-4" /></Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f7f8fa] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary">
          <ArrowLeft className="size-4" /> На головну
        </Link>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stroke-brand-subtle bg-white px-3 py-1.5 text-xs font-medium text-text-brand">
              <span className="size-1.5 rounded-full bg-surface-brand" /> Ручне створення
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-[40px]">Нове оголошення</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">Кілька деталей про товар — і він з’явиться на Vendo.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-white px-3.5 py-2.5 text-xs text-text-secondary shadow-sm sm:self-auto">
            <span className="flex size-7 items-center justify-center rounded-lg bg-surface-primary-subtle"><Check className="size-4 text-text-success" /></span>
            Заповнюйте у зручному темпі
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form onSubmit={submit} className="space-y-5">
            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand"><Camera className="size-5" /></div>
                  <div><p className="font-semibold">Фото товару <span className="text-text-brand">*</span></p><p className="mt-1 text-sm text-text-secondary">Перше фото буде обкладинкою оголошення.</p></div>
                </div>
                <span className="hidden rounded-full bg-surface-primary-subtle px-2.5 py-1 text-xs text-text-tertiary sm:inline-flex">{images.length}/{MAX_IMAGES}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {previews.map((src, index) => (
                  <div key={`${images[index]?.name}-${index}`} className={`group relative aspect-square overflow-hidden rounded-xl border border-stroke-primary-subtle ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <Image src={src} alt={`Фото товару ${index + 1}`} fill unoptimized className="object-cover" />
                    {index === 0 && <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">Обкладинка</span>}
                    <button type="button" aria-label="Видалити фото" onClick={() => { URL.revokeObjectURL(previews[index]); previewUrls.current = previewUrls.current.filter((url) => url !== previews[index]); setImages((current) => current.filter((_, itemIndex) => itemIndex !== index)); setPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/95 text-text-primary opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100"><X className="size-4" /></button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <label className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed ${imageError ? "border-stroke-error bg-surface-error-subtle" : "border-[#c9d5e8] bg-[#fbfcff] hover:border-stroke-brand hover:bg-[#f4f8ff]"} transition ${images.length === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white text-text-brand shadow-sm"><ImagePlus className="size-5" /></span>
                    <span className="text-sm font-medium">{images.length ? "Додати фото" : "Завантажити фото"}</span>
                    <span className="text-center text-xs text-text-tertiary">PNG, JPG до 10 МБ<br />до {MAX_IMAGES} фото</span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImages} />
                  </label>
                )}
              </div>
              {imageError && <p role="alert" className="mt-3 text-sm text-text-error">{imageError}</p>}
            </section>

            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-6 flex gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand"><Tag className="size-5" /></div>
                <div><p className="font-semibold">Про товар</p><p className="mt-1 text-sm text-text-secondary">Назва, категорія та головні характеристики.</p></div>
              </div>
              <div className="space-y-5">
                <label htmlFor="product-title" className="flex flex-col gap-2 text-sm font-medium">Назва оголошення <span className="text-text-brand">*</span>
                  <Input id="product-title" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} maxLength={100} placeholder="Наприклад, iPhone 15 Pro 256 ГБ" className="h-12 px-3.5" />
                  <span className="text-right text-xs font-normal text-text-tertiary">{draft.title.length}/100</span>
                </label>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Категорія <span className="text-text-brand">*</span></p>
                  {selectedCategory && !isCategoryPickerOpen ? (
                    <div className="flex flex-col gap-3 rounded-xl border border-stroke-primary-subtle bg-[#fbfcff] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">{selectedCategory.title}</p>
                        <p className="mt-1 truncate text-xs text-text-tertiary">{selectedCategoryTrail.map((category) => category.title).join(" / ")}</p>
                      </div>
                      <button type="button" onClick={reopenCategoryPicker} className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-medium text-text-brand transition hover:bg-surface-brand-subtle sm:self-auto">Змінити<ChevronRight className="size-4" /></button>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-stroke-primary-subtle bg-white">
                      <div className="border-b border-stroke-secondary p-3 sm:p-4">
                        <div className="mb-3 flex min-h-7 items-center gap-2">
                          {browsePath.length > 0 && (
                            <button type="button" aria-label="Назад до попереднього рівня" onClick={() => { setBrowsePath((current) => current.slice(0, -1)); setCategorySearch(""); }} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-primary-subtle hover:text-text-primary"><ChevronLeft className="size-4" /></button>
                          )}
                          <p className="text-sm font-medium">{browseBreadcrumbs.length ? "Оберіть підкатегорію" : "З чого почнемо?"}</p>
                          {browseBreadcrumbs.length > 0 && <div className="ml-auto hidden min-w-0 items-center gap-1 overflow-hidden text-xs text-text-tertiary sm:flex">{browseBreadcrumbs.map((item, index) => <span key={item.id} className="flex min-w-0 items-center gap-1"><span className="truncate">{item.title}</span>{index < browseBreadcrumbs.length - 1 && <span>/</span>}</span>)}</div>}
                        </div>
                        <Input value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder="Знайти категорію" aria-label="Пошук категорії" start={<Search className="size-4" />} className="h-10 px-3" />
                      </div>
                      <div className="max-h-72 overflow-y-auto p-2">
                        {filteredCategories.length ? filteredCategories.map((category) => (
                          <button key={category.id} type="button" onClick={() => browseCategory(category)} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#f4f7fc] focus-visible:bg-[#f4f7fc]">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5fb] text-text-brand"><Tag className="size-4" /></span>
                            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{category.title}</span><span className="mt-0.5 block text-xs text-text-tertiary">{category.children.length ? `${category.children.length} підкатегорій` : "Обрати цю категорію"}</span></span>
                            {category.children.length ? <ChevronRight className="size-4 shrink-0 text-text-tertiary" /> : <ArrowRight className="size-4 shrink-0 text-text-tertiary" />}
                          </button>
                        )) : <p className="px-3 py-8 text-center text-sm text-text-tertiary">Нічого не знайдено. Спробуйте іншу назву.</p>}
                      </div>
                    </div>
                  )}
                  {categoryError && <p role="alert" className="text-sm text-text-error">{categoryError}</p>}
                </div>
                {selectedCategory?.attributes?.length && !isCategoryPickerOpen ? (
                  <div className="rounded-xl bg-[#fafbfc] p-4 sm:p-5">
                    <p className="mb-4 text-sm font-medium">Характеристики <span className="text-xs font-normal text-text-tertiary">для {selectedCategory.title}</span></p>
                    <div className="grid gap-4 sm:grid-cols-2">{selectedCategory.attributes.map(renderAttribute)}</div>
                  </div>
                ) : null}
                <label htmlFor="product-description" className="flex flex-col gap-2 text-sm font-medium">Опис <span className="text-text-brand">*</span>
                  <textarea id="product-description" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} maxLength={250} rows={5} placeholder="Розкажіть про стан, особливості та комплект товару…" className="w-full resize-y rounded-xl border border-stroke-primary-subtle bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-text-placeholder focus:border-stroke-brand" />
                  <span className="text-right text-xs font-normal text-text-tertiary">{draft.description.length}/250</span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-6 flex gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand"><span className="text-lg font-semibold">₴</span></div>
                <div><p className="font-semibold">Ціна та стан</p><p className="mt-1 text-sm text-text-secondary">Вкажіть вартість і стан речі.</p></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="product-price" className="flex flex-col gap-2 text-sm font-medium">Ціна <span className="text-text-brand">*</span>
                  <div className="relative"><Input id="product-price" type="number" min="0" step="0.01" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} placeholder="0" className="h-12 pr-12 text-base font-medium" /><span className="absolute right-4 top-3.5 text-sm text-text-tertiary">₴</span></div>
                </label>
                <div className="flex flex-col gap-2 text-sm font-medium">Стан товару <span className="text-text-brand">*</span>
                  <div className="grid grid-cols-2 rounded-xl bg-surface-primary-subtle p-1">
                    {([{ value: "used", label: "Вживаний" }, { value: "new", label: "Новий" }] as const).map((item) => <button key={item.value} type="button" onClick={() => updateDraft("condition", item.value)} className={`h-10 rounded-lg text-sm transition ${draft.condition === item.value ? "bg-white font-medium text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}>{item.label}</button>)}
                  </div>
                </div>
                <label htmlFor="product-quantity" className="flex flex-col gap-2 text-sm font-medium sm:max-w-48">Кількість
                  <Input id="product-quantity" type="number" min="1" step="1" value={draft.quantity} onChange={(event) => updateDraft("quantity", event.target.value)} className="h-12" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand"><MapPin className="size-5" /></div>
                  <div><p className="font-semibold">Місце товару</p><p className="mt-1 text-sm text-text-secondary">Покупцям буде видно місто та область.</p></div>
                </div>
                <button type="button" onClick={locateMe} disabled={isLocating} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-text-brand hover:bg-surface-brand-subtle disabled:opacity-60"><MapPin className="size-3.5" />{isLocating ? "Шукаємо…" : "Визначити"}</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="product-city" className="flex flex-col gap-2 text-sm font-medium">Місто <span className="text-text-brand">*</span><Input id="product-city" value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} placeholder="Наприклад, Київ" className="h-11" /></label>
                <label htmlFor="product-region" className="flex flex-col gap-2 text-sm font-medium">Область <span className="text-text-brand">*</span><Input id="product-region" value={draft.region} onChange={(event) => updateDraft("region", event.target.value)} placeholder="Наприклад, Київська" className="h-11" /></label>
                <label htmlFor="product-lat" className="flex flex-col gap-2 text-xs font-normal text-text-secondary">Широта <span className="text-text-brand">*</span><Input id="product-lat" type="number" step="any" min="-90" max="90" value={draft.lat} onChange={(event) => updateDraft("lat", event.target.value)} placeholder="50.4501" className="h-10 text-sm" /></label>
                <label htmlFor="product-lon" className="flex flex-col gap-2 text-xs font-normal text-text-secondary">Довгота <span className="text-text-brand">*</span><Input id="product-lon" type="number" step="any" min="-180" max="180" value={draft.lon} onChange={(event) => updateDraft("lon", event.target.value)} placeholder="30.5234" className="h-10 text-sm" /></label>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-text-tertiary"><CircleHelp className="size-3.5" />Координати потрібні для показу оголошення на мапі.</p>
            </section>

            {formError && <div role="alert" className="rounded-xl border border-stroke-error-subtle bg-surface-error-subtle px-4 py-3 text-sm text-text-error">{formError}</div>}

            <div className="flex flex-col-reverse gap-3 border-t border-stroke-primary-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="secondary" className="w-full sm:w-auto"><Link href="/"><ArrowLeft className="size-4" />Повернутися</Link></Button>
              <Button type="submit" disabled={isSubmitting} className="w-full justify-center sm:w-auto sm:min-w-52">
                {isSubmitting ? "Публікуємо…" : "Опублікувати оголошення"}{!isSubmitting && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-stroke-primary-subtle bg-white shadow-[0_4px_24px_rgba(20,31,54,0.04)]">
              <div className="flex items-center justify-between border-b border-stroke-secondary px-5 py-4"><div><p className="text-sm font-semibold">Попередній перегляд</p><p className="mt-0.5 text-xs text-text-tertiary">Так оголошення побачать люди</p></div><span className="rounded-full bg-surface-success-subtle px-2.5 py-1 text-[11px] font-medium text-text-success">Перегляд</span></div>
              <div className="relative aspect-[4/3] bg-[#f1f3f6]">
                {previews[0] ? <Image src={previews[0]} alt="Попередній перегляд товару" fill unoptimized className="object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-tertiary"><div className="flex size-14 items-center justify-center rounded-2xl bg-white"><ImagePlus className="size-6" /></div><span className="text-xs">Фото товару</span></div>}
                {previews.length > 1 && <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white">+{previews.length - 1} фото</span>}
              </div>
              <div className="p-5">
                <p className="min-h-6 line-clamp-2 font-medium">{draft.title || <span className="text-text-placeholder">Назва вашого товару</span>}</p>
                <p className="mt-2 text-xl font-semibold">{formatPrice(draft.price)} <span className="text-base">₴</span></p>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-text-secondary">{draft.description || <span className="text-text-placeholder">Короткий опис допоможе покупцеві зрозуміти, що ви продаєте.</span>}</p>
                <div className="mt-4 flex items-center justify-between border-t border-stroke-secondary pt-3 text-xs text-text-tertiary"><span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{draft.city || "Ваше місто"}</span><span>{draft.condition === "new" ? "Новий" : "Вживаний"}</span></div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#dce8ff] bg-gradient-to-br from-[#f2f7ff] via-white to-[#f7f4ff] p-5">
              <div className="absolute -right-7 -top-7 size-24 rounded-full bg-[#e8efff] blur-2xl" />
              <div className="relative flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-text-brand shadow-sm"><WandSparkles className="size-4" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">Створити ще простіше</p><span className="rounded-full border border-[#d9def9] bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[#7562c7]">Незабаром</span></div><p className="mt-1.5 text-xs leading-5 text-text-secondary">Додамо ШІ-помічника, який запропонує назву, опис і характеристики за фото.</p><div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7562c7]"><Sparkles className="size-3.5" />Зараз усе під вашим контролем</div></div></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
