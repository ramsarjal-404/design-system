import { forwardRef, type HTMLAttributes } from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * VisuallyHidden — Lepidus Design System primitive
 *
 * Hides content visually while keeping it available to assistive technology
 * (the standard clip-rect pattern). Use it for screen-reader-only labels and
 * announcements — e.g. naming an icon-only control, or extra context inside
 * a live region.
 *
 * Renders a `<span>`; all native span attributes pass through.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    />
  )
);

VisuallyHidden.displayName = 'VisuallyHidden';
