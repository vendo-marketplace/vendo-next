const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

type UkrainianTimeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

const unitForms: Record<UkrainianTimeUnit, [string, string, string]> = {
  minute: ['хвилину', 'хвилини', 'хвилин'],
  hour: ['годину', 'години', 'годин'],
  day: ['день', 'дні', 'днів'],
  week: ['тиждень', 'тижні', 'тижнів'],
  month: ['місяць', 'місяці', 'місяців'],
  year: ['рік', 'роки', 'років'],
};

const getPluralForm = (value: number) => {
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return 0;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return 1;
  }

  return 2;
};

const formatUnit = (value: number, unit: UkrainianTimeUnit) =>
  `${value} ${unitForms[unit][getPluralForm(value)]} тому`;

const getCalendarDay = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_IN_MS;

export const formatRelativeTime = (value: string, now: Date = new Date()): string => {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) return value;

  const differenceInMs = now.getTime() - createdAt.getTime();

  if (differenceInMs < MINUTE_IN_MS) return 'щойно';
  if (differenceInMs < HOUR_IN_MS) {
    return formatUnit(Math.floor(differenceInMs / MINUTE_IN_MS), 'minute');
  }
  if (differenceInMs < 4 * HOUR_IN_MS) {
    return formatUnit(Math.floor(differenceInMs / HOUR_IN_MS), 'hour');
  }

  const differenceInDays = getCalendarDay(now) - getCalendarDay(createdAt);

  if (differenceInDays <= 0) return 'сьогодні';
  if (differenceInDays === 1) return 'учора';
  if (differenceInDays < 7) return formatUnit(differenceInDays, 'day');
  if (differenceInDays < 30) {
    return formatUnit(Math.floor(differenceInDays / 7), 'week');
  }
  if (differenceInDays < 365) {
    return formatUnit(Math.floor(differenceInDays / 30), 'month');
  }

  return formatUnit(Math.floor(differenceInDays / 365), 'year');
};
