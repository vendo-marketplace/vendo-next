// Mirrors ATTRIBUTE_TITLE_PATTERN / CATEGORY_TITLE_PATTERN in product-service's
// ProductPatterns: capital first letter, words separated by single spaces.
export const TITLE_PATTERN =
  /^[A-ZА-ЯІЇЄ][A-Za-zА-Яа-яІіЇїЄє0-9'’/,-]*(?: [A-Za-zА-Яа-яІіЇїЄє0-9'’/,-]+)*$/;

// The Ukrainian keyboard types "ʼ" (U+02BC), which the API does not accept.
export const normalizeApostrophes = (value: string) => value.replace(/ʼ/g, "’");
