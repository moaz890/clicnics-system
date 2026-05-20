import { format, isBefore, startOfDay, startOfToday } from "date-fns";

/** `YYYY-MM-DD` for API query params */
export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isDateBeforeToday(date: Date): boolean {
  return isBefore(startOfDay(date), startOfToday());
}

export function getToday(): Date {
  return startOfToday();
}
