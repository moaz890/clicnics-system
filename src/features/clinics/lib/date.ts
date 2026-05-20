import { isBefore, startOfDay, startOfToday } from "date-fns";

const API_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar date as `YYYY-MM-DD` (e.g. `2026-05-20`) for API query params */
export function toApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Ensures the value sent to the API is a plain `YYYY-MM-DD` string */
export function stringifyApiDate(value: Date | string): string {
  if (typeof value === "string") {
    if (API_DATE_PATTERN.test(value)) {
      return value;
    }
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return toApiDate(parsed);
    }
    return value;
  }
  return toApiDate(value);
}

export function parseApiDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isDateBeforeToday(date: Date): boolean {
  return isBefore(startOfDay(date), startOfToday());
}

export function getToday(): Date {
  return startOfToday();
}
