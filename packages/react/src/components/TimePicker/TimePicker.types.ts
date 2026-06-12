import { type HTMLAttributes } from 'react';

export type TimePeriod = 'AM' | 'PM';

export interface TimePickerValue {
  hour: number;
  minute: number;
  /** null in 24-hour mode. */
  period: TimePeriod | null;
}

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Overline label. Default "Enter Time". */
  label?: string;
  /** Initial hour (1–12 in 12h mode, 0–23 in 24h). */
  defaultHour?: number;
  /** Initial minute (0–59). */
  defaultMinute?: number;
  /** Initial AM/PM (12h mode only). Default "AM". */
  defaultPeriod?: TimePeriod;
  /** Use 24-hour clock (hides the AM/PM toggle). Default false. */
  use24Hour?: boolean;
  /** Footer — Cancel. */
  onCancel?: () => void;
  /** Footer — OK. Receives the chosen time. */
  onConfirm?: (value: TimePickerValue) => void;
}
