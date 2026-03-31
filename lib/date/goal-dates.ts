import { differenceInCalendarDays, format, parseISO, isValid } from "date-fns";

/**
 * Returns whole-day difference from today to the goal's endDate.
 * Negative means overdue.
 */
export function getDaysLeft(endDate: string): number {
  const end = parseISO(endDate);
  if (!isValid(end)) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInCalendarDays(end, today);
}

/** A goal is urgent when it has 3 or fewer days left (and is not already past). */
export function isUrgent(daysLeft: number): boolean {
  return daysLeft <= 3;
}

/** Human-readable label for a goal's end date, e.g. "Apr 1, 2026". */
export function formatGoalDate(endDate: string): string {
  const end = parseISO(endDate);
  if (!isValid(end)) return endDate;
  return format(end, "MMM d, yyyy");
}

/**
 * Returns true when a date string is a valid ISO date that is
 * today or in the future (not in the past).
 */
export function isValidFutureOrTodayDate(dateString: string): boolean {
  const date = parseISO(dateString);
  if (!isValid(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}
