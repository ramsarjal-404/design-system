import { type HTMLAttributes } from 'react';

/** Thumb state.
 *  - `default`  → neutral resting thumb (component/scrollbar/thumb)
 *  - `active`   → engaged / dragging (color/button/secondary/bg, brand blue-200)
 *  - `disabled` → non-interactive (color/button/disabled/bg) */
export type ScrollbarVariant = 'default' | 'active' | 'disabled';

export type ScrollbarOrientation = 'vertical' | 'horizontal';

export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Thumb state — defaults to `active` (the Figma default property). */
  variant?: ScrollbarVariant;
  /** Track direction — defaults to `vertical`. */
  orientation?: ScrollbarOrientation;
  /** Thumb length as a percentage of the track (0–100). Default 26 (≈117/451 from Figma). */
  thumbSize?: number;
  /** Thumb offset from the track start as a percentage (0–100). Default 0. */
  thumbOffset?: number;
  /** Track length along its axis (px or any CSS length). Default 451px (Figma). */
  length?: number | string;
}
