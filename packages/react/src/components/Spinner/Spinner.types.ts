import { type HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter — sm (16px, inline/buttons), md (24px, default) or lg (32px, page regions). */
  size?: SpinnerSize;
  /**
   * Accessible label announced by screen readers via a visually hidden span
   * inside the `role="status"` root. Default "Loading…".
   */
  label?: string;
  /** Extra class on the root element. */
  className?: string;
}
