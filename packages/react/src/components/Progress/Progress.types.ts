import { type HTMLAttributes, type ReactNode } from 'react';

/** Status of the task being tracked.
 *  - `in-progress` → cyan bar + "{value}%" readout
 *  - `completed`   → green bar (forced 100%) + "100%" readout
 *  - `pending`     → full gray bar + clock icon (queued / waiting)
 *  - `auto` (default) → derives: 100 → completed, otherwise in-progress */
export type ProgressStatus = 'auto' | 'in-progress' | 'completed' | 'pending';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Status label above the bar (e.g. "Restore in Progress") */
  label: ReactNode;
  /** Completion 0–100. Ignored for `pending` (full track) and `completed` (100). */
  value?: number;
  /** Visual status — defaults to `auto` (derived from value) */
  status?: ProgressStatus;
  /** Show the percentage readout next to the bar (clock icon replaces it when pending) */
  showValue?: boolean;
  /** Stretch to fill the container width (default fixed 274px from Figma) */
  fullWidth?: boolean;
}
