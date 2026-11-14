// Ukrainian national transliteration (KMU 2010), simplified for slugs.
const TRANSLITERATION: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
  з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": "", "’": "",
};

// Produces a slug matching the API pattern `^[a-z0-9]+(?:_[a-z0-9]+)*$`.
export const slugify = (title: string) =>
  [...title.toLocaleLowerCase("uk")]
    .map((char) => TRANSLITERATION[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
