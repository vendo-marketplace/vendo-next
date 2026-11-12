import { formatRelativeTime } from "@/utils/format-relative-time";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_DAYS = 7;
const TWO_WEEKS_IN_DAYS = 14;

const getCalendarDay = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_IN_MS;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// The listing date as the Figma product card shows it: "Сьогодні, 11:02", "Вчора",
// "3 дні тому", "Тиждень тому"; older dates fall back to the shared relative format.
export const formatListingDate = (value: string, now: Date = new Date()) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return value;

  const daysAgo = getCalendarDay(now) - getCalendarDay(createdAt);
  if (daysAgo <= 0) {
    const time = createdAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    return `Сьогодні, ${time}`;
  }
  if (daysAgo === 1) return "Вчора";
  if (daysAgo >= WEEK_IN_DAYS && daysAgo < TWO_WEEKS_IN_DAYS) return "Тиждень тому";
  return capitalize(formatRelativeTime(value, now));
};

const MONTH_IN_DAYS = 30;
const YEAR_IN_DAYS = 365;

// For the narrow phone card, so the city keeps its room: "14:39", "Вчора", "3 дн.", "1 тиж.".
export const formatListingDateShort = (value: string, now: Date = new Date()) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return value;

  const daysAgo = getCalendarDay(now) - getCalendarDay(createdAt);
  if (daysAgo <= 0) {
    return createdAt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  }
  if (daysAgo === 1) return "Вчора";
  if (daysAgo < WEEK_IN_DAYS) return `${daysAgo} дн.`;
  if (daysAgo < MONTH_IN_DAYS) return `${Math.floor(daysAgo / WEEK_IN_DAYS)} тиж.`;
  if (daysAgo < YEAR_IN_DAYS) return `${Math.floor(daysAgo / MONTH_IN_DAYS)} міс.`;
  return `${Math.floor(daysAgo / YEAR_IN_DAYS)} р.`;
};
