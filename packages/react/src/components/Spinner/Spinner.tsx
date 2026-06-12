import { forwardRef } from 'react';
import type { SpinnerProps } from './Spinner.types';
import styles from './Spinner.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Spinner — Lepidus Design System
 *
 * Indeterminate loading indicator: a brand-blue SVG arc rotating over a
 * subtle gray track, in three sizes (sm 16 / md 24 / lg 32). The root renders
 * `role="status"` with a visually hidden `label` ("Loading…" by default) so
 * screen readers announce the wait; the SVG itself is `aria-hidden`. Under
 * `prefers-reduced-motion` the rotation is replaced by a slow opacity pulse.
 *
 * Use Spinner for indeterminate waits with no known shape (submitting,
 * refreshing). If the incoming content's layout is known, prefer Skeleton;
 * for measurable progress, use Progress.
 *
 * No dedicated Figma frame yet — built token-first; add the frame and node
 * link when designed.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', label = 'Loading…', className, ...props }, ref) => (
    <span ref={ref} role="status" className={cx(styles.root, styles[size], className)} {...props}>
      <svg className={styles.svg} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="10" strokeWidth="3" />
        <circle
          className={styles.arc}
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="28 72"
        />
      </svg>
      {/* Visually hidden (clip-rect pattern) — announced, never painted. */}
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  )
);

Spinner.displayName = 'Spinner';
