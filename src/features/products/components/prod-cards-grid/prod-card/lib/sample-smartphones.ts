import type { ProductCardType } from "@/types/product";

// TODO(api): the 18 phones from the Figma category page (node 5629:35802), shown after the
// real smartphones while the backend has only a few listings. Remove once real data is there.
export const SMARTPHONES_CATEGORY_ID = "6a674e9773ed96015d378b81";
export const BRAND_ATTRIBUTE_ID = "6a674e8673ed96015d378b80";
export const SAMPLE_STORAGE_ATTRIBUTE_ID = "sample-storage";
export const SAMPLE_BATTERY_ATTRIBUTE_ID = "sample-battery";

const SAMPLE_ID_PREFIX = "sample-phone-";
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export type SampleCondition = "new" | "like-new" | "used";

type SamplePhone = {
  title: string;
  brand: string;
  price: number;
  condition: SampleCondition;
  storage: string;
  // Battery health, or "Гарантія" for a new phone, as the third cell of the card.
  extra: string;
  city: string;
  ageInMs: number;
  photo: string;
};

const SAMPLE_PHONES: SamplePhone[] = [
  { title: "iPhone 15 Pro 256 ГБ, Blue Titanium", brand: "Apple", price: 32900, condition: "like-new", storage: "256 ГБ", extra: "93%", city: "Київ", ageInMs: 2 * HOUR_IN_MS, photo: "iphone-15-pro" },
  { title: "iPhone 17 Pro Max 256 ГБ, Cosmic Orange", brand: "Apple", price: 62500, condition: "new", storage: "256 ГБ", extra: "Гарантія", city: "Київ", ageInMs: 3 * HOUR_IN_MS, photo: "iphone-17-pro-max" },
  { title: "iPhone 14 128 ГБ, White", brand: "Apple", price: 16900, condition: "used", storage: "128 ГБ", extra: "86%", city: "Львів", ageInMs: 4 * HOUR_IN_MS, photo: "iphone-14" },
  { title: "Samsung Galaxy A36 5G 128 ГБ", brand: "Samsung", price: 11400, condition: "new", storage: "128 ГБ", extra: "Гарантія", city: "Рівне", ageInMs: 5 * HOUR_IN_MS, photo: "galaxy-a36" },
  { title: "Google Pixel 9 128 ГБ, Obsidian", brand: "Google", price: 19900, condition: "like-new", storage: "128 ГБ", extra: "97%", city: "Київ", ageInMs: DAY_IN_MS, photo: "pixel-9" },
  { title: "OnePlus 13 512 ГБ, Black Eclipse", brand: "OnePlus", price: 31500, condition: "like-new", storage: "512 ГБ", extra: "Відмінний", city: "Харків", ageInMs: DAY_IN_MS + HOUR_IN_MS, photo: "oneplus-13" },
  { title: "Poco X7 Pro 256 ГБ, Yellow", brand: "Poco", price: 12400, condition: "new", storage: "256 ГБ", extra: "Гарантія", city: "Дніпро", ageInMs: DAY_IN_MS + 2 * HOUR_IN_MS, photo: "poco-x7-pro" },
  { title: "Motorola Edge 50 Pro 512 ГБ, Moonlight Pearl", brand: "Motorola", price: 12900, condition: "new", storage: "512 ГБ", extra: "Гарантія", city: "Миколаїв", ageInMs: DAY_IN_MS + 3 * HOUR_IN_MS, photo: "motorola-edge-50-pro" },
  { title: "iPhone 13 Pro 128 ГБ, Sierra Blue", brand: "Apple", price: 19800, condition: "used", storage: "128 ГБ", extra: "84%", city: "Одеса", ageInMs: 2 * DAY_IN_MS, photo: "iphone-13-pro" },
  { title: "Samsung Galaxy Z Flip7 256 ГБ, Gray", brand: "Samsung", price: 33900, condition: "like-new", storage: "256 ГБ", extra: "Відмінний", city: "Київ", ageInMs: 2 * DAY_IN_MS + HOUR_IN_MS, photo: "galaxy-z-flip7" },
  { title: "Redmi Note 13 Pro 256 ГБ, Ocean Blue", brand: "Xiaomi", price: 8900, condition: "used", storage: "256 ГБ", extra: "Добрий", city: "Черкаси", ageInMs: 2 * DAY_IN_MS + 2 * HOUR_IN_MS, photo: "redmi-note-13-pro" },
  { title: "Google Pixel 9 128 ГБ, Porcelain", brand: "Google", price: 18500, condition: "like-new", storage: "128 ГБ", extra: "96%", city: "Вінниця", ageInMs: 3 * DAY_IN_MS, photo: "pixel-9-porcelain" },
  { title: "iPhone 13 Pro 256 ГБ, Sierra Blue", brand: "Apple", price: 21900, condition: "used", storage: "256 ГБ", extra: "88%", city: "Запоріжжя", ageInMs: 3 * DAY_IN_MS + HOUR_IN_MS, photo: "iphone-13-pro-256" },
  { title: "Xiaomi 14T Pro 512 ГБ, Titan Gray", brand: "Xiaomi", price: 22800, condition: "like-new", storage: "512 ГБ", extra: "Відмінний", city: "Київ", ageInMs: 3 * DAY_IN_MS + 2 * HOUR_IN_MS, photo: "xiaomi-14t-pro" },
  { title: "iPhone 15 Pro Max 256 ГБ, White Titanium", brand: "Apple", price: 38500, condition: "new", storage: "256 ГБ", extra: "Гарантія", city: "Львів", ageInMs: 4 * DAY_IN_MS, photo: "iphone-15-pro-max" },
  { title: "iPhone 15 Pro 128 ГБ, Natural Titanium", brand: "Apple", price: 28500, condition: "used", storage: "128 ГБ", extra: "89%", city: "Одеса", ageInMs: 4 * DAY_IN_MS + HOUR_IN_MS, photo: "iphone-15-pro-natural" },
  { title: "iPhone 11 Pro 64 ГБ, Midnight Green", brand: "Apple", price: 9800, condition: "used", storage: "64 ГБ", extra: "79%", city: "Полтава", ageInMs: 5 * DAY_IN_MS, photo: "iphone-11-pro" },
  { title: "Xiaomi Mi Note 10 128 ГБ, Midnight Black", brand: "Xiaomi", price: 4900, condition: "used", storage: "128 ГБ", extra: "Добрий", city: "Тернопіль", ageInMs: 7 * DAY_IN_MS, photo: "mi-note-10" },
];

export const isSampleProduct = (id: string) => id.startsWith(SAMPLE_ID_PREFIX);

const toCard = (phone: SamplePhone, index: number, now: number): ProductCardType => ({
  id: `${SAMPLE_ID_PREFIX}${index + 1}`,
  title: phone.title,
  description: "",
  quantity: 1,
  isNew: phone.condition === "new",
  price: phone.price,
  ownerId: "",
  categoryId: SMARTPHONES_CATEGORY_ID,
  address: { city: phone.city },
  attributes: [
    { id: BRAND_ATTRIBUTE_ID, values: [phone.brand] },
    { id: SAMPLE_STORAGE_ATTRIBUTE_ID, values: [phone.storage] },
    { id: SAMPLE_BATTERY_ATTRIBUTE_ID, values: [phone.extra] },
  ],
  images: [`/mock/phones/${phone.photo}.jpg`],
  active: true,
  createdAt: new Date(now - phone.ageInMs).toISOString(),
});

export type SampleSmartphone = {
  card: ProductCardType;
  brand: string;
  storage: string;
  condition: SampleCondition;
};

export const getSampleSmartphones = (now = Date.now()): SampleSmartphone[] =>
  SAMPLE_PHONES.map((phone, index) => ({
    card: toCard(phone, index, now),
    brand: phone.brand,
    storage: phone.storage,
    condition: phone.condition,
  }));

const SAMPLE_CONDITIONS = new Map(
  SAMPLE_PHONES.map((phone, index) => [`${SAMPLE_ID_PREFIX}${index + 1}`, phone.condition]),
);

export const getSampleCondition = (id: string) => SAMPLE_CONDITIONS.get(id);
