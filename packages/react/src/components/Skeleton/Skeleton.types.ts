import { type HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Shape of the placeholder — `text` (rounded line matching body text),
   * `circle` (avatar/icon) or `rect` (image/card block). Default `text`.
   */
  variant?: SkeletonVariant;
  /** Width — a number is treated as px, a string passes through (`'100%'`, `'12rem'`). */
  width?: number | string;
  /** Height — a number is treated as px, a string passes through. Circles default to `width`. */
  height?: number | string;
  /**
   * For `variant="text"`: render this many stacked lines, the last one cut to
   * 60% width so the block reads as a paragraph. Default 1.
   */
  lines?: number;
  /** Extra class on the root element. */
  className?: string;
}
