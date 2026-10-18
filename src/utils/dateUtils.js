
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";

export const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Custom Range", value: "custom" },
];

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const parseDate = (value) => {
  if (!value) return null;

  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  return isValidDate(date) ? date : null;
};

export const toDateKey = (value) => {
  const date = parseDate(value);

  return date ? format(date, "yyyy-MM-dd") : "";
};

export const getDateRange = (
  preset = "30d",
  customStart = "",
  customEnd = "",
  referenceDate = new Date()
) => {
  const reference = parseDate(referenceDate) ?? new Date();
  const today = startOfDay(reference);
  const todayEnd = endOfDay(today);

  if (preset === "today") {
    return {
      startDate: today,
      endDate: todayEnd,
    };
  }

  if (preset === "7d") {
    return {
      startDate: startOfDay(subDays(today, 6)),
      endDate: todayEnd,
    };
  }

  if (preset === "30d") {
    return {
      startDate: startOfDay(subDays(today, 29)),
      endDate: todayEnd,
    };
  }

if (preset === "custom") {
  const start = customStart
    ? parseDate(customStart)
    : today;

  const end = customEnd
    ? parseDate(customEnd)
    : today;

  if (!start || !end) {
    return { startDate: today, endDate: todayEnd };
  }

  const startDate = startOfDay(start);
  const endDate = endOfDay(end);

  if (startDate.getTime() > endDate.getTime()) {
    return { startDate: today, endDate: todayEnd };
  }

  return { startDate, endDate };
}

  return getDateRange("30d", "", "", reference);
};

export const getPreviousDateRange = (
  rangeOrStart,
  optionalEnd
) => {
  const startDate =
    rangeOrStart instanceof Date
      ? rangeOrStart
      : rangeOrStart?.startDate;

  const endDate =
    optionalEnd instanceof Date
      ? optionalEnd
      : rangeOrStart?.endDate;

  if (
    !isValidDate(startDate) ||
    !isValidDate(endDate) ||
    startDate > endDate
  ) {
    return getDateRange("30d");
  }

  const days =
    differenceInCalendarDays(
      startOfDay(endDate),
      startOfDay(startDate)
    ) + 1;

  const previousEnd = subDays(startOfDay(startDate), 1);

  return {
    startDate: startOfDay(subDays(previousEnd, days - 1)),
    endDate: endOfDay(previousEnd),
  };
};

export const isDateInRange = (
  value,
  rangeOrStart,
  optionalEnd
) => {
  if (!value || !rangeOrStart) return false;

  const date = parseDate(value);

  const startDate =
    rangeOrStart instanceof Date
      ? rangeOrStart
      : rangeOrStart?.startDate;

  const endDate =
    optionalEnd instanceof Date
      ? optionalEnd
      : rangeOrStart?.endDate;

  if (
    !date ||
    !isValidDate(startDate) ||
    !isValidDate(endDate) ||
    startDate > endDate
  ) {
    return false;
  }

  return date >= startDate && date <= endDate;
};

export const getDateLabel = (value) => {
  const date = parseDate(value);

  return date ? format(date, "dd MMM") : "";
};

export const getInclusiveDays = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end || start > end) {
    return 0;
  }

  return (
    differenceInCalendarDays(
      startOfDay(end),
      startOfDay(start)
    ) + 1
  );
};

export const shiftDate = (value, amount) => {
  const date = parseDate(value);

  if (!date || !Number.isFinite(Number(amount))) {
    return null;
  }

  return addDays(date, Number(amount));
};
