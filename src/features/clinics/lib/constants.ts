export const SLOT_DURATION_OPTIONS = [15, 30, 45, 60] as const;

export const WEEK_DAYS = [
  { key: "monday", labelKey: "monday" },
  { key: "tuesday", labelKey: "tuesday" },
  { key: "wednesday", labelKey: "wednesday" },
  { key: "thursday", labelKey: "thursday" },
  { key: "friday", labelKey: "friday" },
  { key: "saturday", labelKey: "saturday" },
  { key: "sunday", labelKey: "sunday" },
] as const;

export const DEFAULT_SCHEDULE_TEMPLATE = WEEK_DAYS.map((day) => ({
  day: day.key,
  enabled: false,
  startTime: "09:00",
  endTime: "17:00",
}));
