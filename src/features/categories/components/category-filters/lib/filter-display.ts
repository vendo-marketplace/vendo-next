import type { CategoryAttribute } from "../../../types/category";

const COLOR_SWATCHES: Record<string, string> = {
  чорний: "#292929",
  білий: "#ffffff",
  синій: "#105fff",
  блакитний: "#50a6ff",
  зелений: "#008236",
  сірий: "#989898",
  червоний: "#ef0d12",
  жовтий: "#ffb132",
  помаранчевий: "#ff980a",
  фіолетовий: "#862eef",
  рожевий: "#ff9a9c",
  золотий: "#d4af37",
  срібний: "#c0c0c0",
};

export const getColorSwatch = (value: string) =>
  COLOR_SWATCHES[value.trim().toLowerCase()];

export const isColorAttribute = (attribute: CategoryAttribute) =>
  /colou?r|колір/i.test(`${attribute.slug} ${attribute.title}`);

const CHIP_MAX_OPTIONS = 6;
const CHIP_MAX_LABEL_LENGTH = 10;

// Short value sets (memory, battery) read better as chips, long ones as a checkbox list.
export const shouldRenderAsChips = (options: string[]) =>
  options.length <= CHIP_MAX_OPTIONS &&
  options.every((option) => option.length <= CHIP_MAX_LABEL_LENGTH);

const formatAmount = (value: string) => Number(value).toLocaleString("uk-UA");

export const formatRange = (min: string, max: string) =>
  [min && `від ${formatAmount(min)}`, max && `до ${formatAmount(max)}`]
    .filter(Boolean)
    .join(" ");

const pluralRules = new Intl.PluralRules("uk-UA");
const LISTING_FORMS: Record<string, string> = {
  one: "оголошення",
  few: "оголошення",
  many: "оголошень",
  other: "оголошення",
};

export const formatListingsCount = (count: number) =>
  `${count.toLocaleString("uk-UA")} ${LISTING_FORMS[pluralRules.select(count)]}`;

export const formatListingsFound = (count: number) => `Знайдено ${formatListingsCount(count)}`;
