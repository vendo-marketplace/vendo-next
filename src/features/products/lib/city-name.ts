import { UKRAINIAN_CITIES } from "@/features/products/constants/ukrainian-cities";

// Official Ukrainian romanization (Cabinet of Ministers resolution No. 55, 2010).
const ROMANIZATION: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
  з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": "", "’": "",
};

// At the start of a word these letters are romanized differently.
const WORD_START_ROMANIZATION: Record<string, string> = {
  є: "ye", ї: "yi", й: "y", ю: "yu", я: "ya",
};

// Older spellings that the official romanization doesn't produce.
const LEGACY_SPELLINGS: Record<string, string> = {
  kiev: "Київ",
  odessa: "Одеса",
  kharkov: "Харків",
  lvov: "Львів",
  dnepr: "Дніпро",
  dnipropetrovsk: "Дніпро",
  zaporozhye: "Запоріжжя",
  nikolaev: "Миколаїв",
  rovno: "Рівне",
  chernovtsy: "Чернівці",
};

const romanize = (city: string) =>
  city
    .toLocaleLowerCase("uk")
    .replaceAll("зг", "zgh")
    .replace(/[а-яґєії'’]/g, (letter, index: number, text: string) => {
      const isWordStart = index === 0 || /[\s-]/.test(text[index - 1]);
      return (isWordStart && WORD_START_ROMANIZATION[letter]) || ROMANIZATION[letter];
    });

const normalizeLatin = (city: string) =>
  city.trim().toLowerCase().replace(/['’`ʼ]/g, "").replace(/\s+/g, " ");

const CITY_BY_LATIN_NAME = new Map<string, string>([
  ...UKRAINIAN_CITIES.map((city): [string, string] => [romanize(city), city]),
  ...Object.entries(LEGACY_SPELLINGS),
]);

/** Shows a city in Ukrainian even if it was saved in Latin script (e.g. "Kyiv" → "Київ"). */
export const toUkrainianCityName = (city: string) =>
  CITY_BY_LATIN_NAME.get(normalizeLatin(city)) ?? city;
