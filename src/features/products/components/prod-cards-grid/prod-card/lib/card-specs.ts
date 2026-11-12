import type { ProductCardType } from "@/types/product";

import {
  BRAND_ATTRIBUTE_ID,
  getSampleCondition,
  isSampleProduct,
  SAMPLE_BATTERY_ATTRIBUTE_ID,
  SAMPLE_STORAGE_ATTRIBUTE_ID,
  SMARTPHONES_CATEGORY_ID,
  type SampleCondition,
} from "./sample-smartphones";

// The card shows the condition plus two specs, as in the Figma product card.
export const MAX_CARD_SPECS = 2;

// TODO(api): smartphones only carry a brand attribute so far. Until the backend adds storage
// and battery, the card shows sample values so it keeps the Figma layout. Remove with the mocks.
const SAMPLE_STORAGE = ["128 ГБ", "256 ГБ", "512 ГБ"];
// As on the Figma category page: a like-new phone keeps 92–99% of its battery, a used one 80–91%.
const LIKE_NEW_BATTERY_MIN = 92;
const BATTERY_MIN = 80;
const BATTERY_SPREAD = 20;

// Phone photos from the Figma category page, by brand. The backend only has placeholder
// drawings (SVG) for these products; real uploads (JPG, PNG) are kept.
const SAMPLE_PHONE_PHOTOS: Record<string, string[]> = {
  apple: ["iphone-15-pro", "iphone-17-pro-max", "iphone-14", "iphone-13-pro"],
  samsung: ["galaxy-z-flip7", "galaxy-a36"],
  google: ["pixel-9"],
  oneplus: ["oneplus-13"],
  xiaomi: ["poco-x7-pro"],
  motorola: ["motorola-edge-50-pro"],
};

// Same product, same sample values on every render.
const hashId = (id: string) =>
  [...id].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);

// "iPhone 16 Pro 256GB" already names its storage; only otherwise is a sample picked.
const getStorageFromTitle = (title: string) => {
  const match = title.match(/(\d+)\s*(gb|гб|tb|тб)(?![a-zа-яё])/i);
  if (!match) return undefined;
  const unit = /t|т/i.test(match[2]) ? "ТБ" : "ГБ";
  return `${match[1]} ${unit}`;
};

const getSampleStorage = (card: ProductCardType) =>
  getStorageFromTitle(card.title) ?? SAMPLE_STORAGE[hashId(card.id) % SAMPLE_STORAGE.length];

// Brands whose models are named without the brand ("iPhone 16"), as in the Figma titles.
const BRANDS_WITHOUT_PREFIX = new Set(["apple"]);
const KNOWN_BRANDS = new Set(["apple", "samsung", "google", "xiaomi", "poco", "oneplus", "motorola", "nokia", "nothing", "realme"]);
const STORAGE_IN_TITLE = /\s*\d+\s*(gb|гб|tb|тб)(?![a-zа-яё])/i;

// TODO(api): backend titles are often a bare model ("13", "Phone (2a)"). Until sellers write
// full titles, a smartphone is shown as in Figma: "Brand Model 256 ГБ".
export const getCardTitle = (card: ProductCardType) => {
  if (!isSmartphone(card) || isSampleProduct(card.id)) return card.title;
  const brand = card.attributes.find((attribute) => attribute.id === BRAND_ATTRIBUTE_ID)?.values?.[0];
  if (!brand || !KNOWN_BRANDS.has(brand.toLowerCase())) return card.title;

  const model = card.title
    .replace(/^смартфон\s+/i, "")
    .replace(new RegExp(`^${brand}\\s+`, "i"), "")
    .replace(STORAGE_IN_TITLE, "")
    .trim();
  const withBrand = BRANDS_WITHOUT_PREFIX.has(brand.toLowerCase()) ? model : `${brand} ${model}`;
  return `${withBrand} ${getSampleStorage(card)}`;
};

export type CardCondition = SampleCondition;

// Which icon a spec gets on the card.
export type SpecKind = "storage" | "battery" | "warranty" | "other";
export type CardSpec = { kind: SpecKind; value: string };

const KIND_BY_ATTRIBUTE_ID: Record<string, SpecKind> = {
  [SAMPLE_STORAGE_ATTRIBUTE_ID]: "storage",
  [SAMPLE_BATTERY_ATTRIBUTE_ID]: "battery",
};

// Real attributes carry no type on the card, so the kind is read from the value itself.
const getSpecKind = (value: string, attributeId?: string): SpecKind => {
  if (/гарант/i.test(value)) return "warranty";
  const known = attributeId && KIND_BY_ATTRIBUTE_ID[attributeId];
  if (known) return known;
  if (/\d\s*(гб|тб|gb|tb)(?![a-zа-яё])/i.test(value)) return "storage";
  if (/\d\s*%/.test(value)) return "battery";
  return "other";
};

const isSmartphone = (card: ProductCardType) =>
  card.categoryId === SMARTPHONES_CATEGORY_ID;

const getSampleBattery = (card: ProductCardType) =>
  BATTERY_MIN + (hashId(card.id) % BATTERY_SPREAD);

// TODO(api): the backend only knows new/used. Until it has "like-new", a used phone with a
// sample battery of 92% or more is shown as like-new.
export const getCardCondition = (card: ProductCardType): CardCondition => {
  const sampleCondition = getSampleCondition(card.id);
  if (sampleCondition) return sampleCondition;
  if (card.isNew) return "new";
  return isSmartphone(card) && getSampleBattery(card) >= LIKE_NEW_BATTERY_MIN
    ? "like-new"
    : "used";
};

// A new phone shows its warranty, a used one its battery, as in the Figma cards.
const getSampleSmartphoneSpecs = (card: ProductCardType): CardSpec[] => {
  const storage = getSampleStorage(card);
  return card.isNew
    ? [
        { kind: "storage", value: storage },
        { kind: "warranty", value: "Гарантія" },
      ]
    : [
        { kind: "storage", value: storage },
        { kind: "battery", value: `${getSampleBattery(card)}%` },
      ];
};

const isPlaceholderImage = (url: string | undefined) =>
  !url || url.endsWith(".svg");

export const getCardImage = (card: ProductCardType) => {
  const [image] = card.images;
  if (!isSmartphone(card) || !isPlaceholderImage(image)) return image;

  const brand = card.attributes.find(
    (attribute) => attribute.id === BRAND_ATTRIBUTE_ID,
  );
  const photos = SAMPLE_PHONE_PHOTOS[brand?.values?.[0]?.toLowerCase() ?? ""];
  if (!photos) return image;
  return `/mock/phones/${photos[hashId(card.id) % photos.length]}.jpg`;
};

// The brand is left out: it repeats the title and is not a spec.
export const getCardSpecs = (card: ProductCardType): CardSpec[] => {
  const specs = card.attributes
    .filter((attribute) => attribute.id !== BRAND_ATTRIBUTE_ID)
    .flatMap((attribute) =>
      (attribute.values ?? [])
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => ({ kind: getSpecKind(value, attribute.id), value })),
    );

  if (isSmartphone(card)) specs.push(...getSampleSmartphoneSpecs(card));
  return specs.slice(0, MAX_CARD_SPECS);
};
