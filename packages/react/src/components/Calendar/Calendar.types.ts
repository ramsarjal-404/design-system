import { type HTMLAttributes } from 'react';

/** Schedule frequency — controls which extra selectors appear.
 *  - `daily`   → calendar grid + time
 *  - `weekly`  → + "Select Month" weekday chips
 *  - `monthly` → + weekday chips + "Select Date" chips */
export type CalendarVariant = 'daily' | 'weekly' | 'monthly';

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Schedule type. Default `daily`. */
  variant?: CalendarVariant;
  /** Heading text. Defaults to "<Variant> Schedule". */
  title?: string;
  /** Initial month shown (0–11). Defaults to the current month. */
  defaultMonth?: number;
  /** Initial year shown. Defaults to the current year. */
  defaultYear?: number;
  /** Initially selected day of month (1–31). */
  defaultSelectedDate?: number;
  /** First/last year offered in the year dropdown, relative to today. Default ±5. */
  yearRange?: [number, number];
  /** Days of the shown month (1–31) to mark with an event dot. */
  markedDates?: number[];
  /** Fired when the user picks a day. */
  onSelectDate?: (date: { year: number; month: number; day: number }) => void;
  /** Footer — Cancel. */
  onCancel?: () => void;
  /** Footer — Done. Receives the full current selection. */
  onDone?: (value: CalendarValue) => void;
}

export interface CalendarValue {
  year: number;
  month: number;
  day: number | null;
  time: { h: number | null; m: number | null; s: number | null };
  /** weekly/monthly — selected weekday indices (0=Sun…6=Sat). */
  weekdays: number[];
  /** monthly — selected dates (1–31). */
  dates: number[];
}
