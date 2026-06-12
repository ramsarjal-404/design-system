import { forwardRef } from 'react';
import type { TagProps } from './Tag.types';
import styles from './Tag.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const CrossIcon = () => (
  <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M1 1l6 6M7 1L1 7" />
  </svg>
);

/**
 * Tag — Lepidus Design System
 *
 * Interactive chip matching the Figma "Tag" component (node 9:8): a bordered
 * pill for objects the user put there — applied filters, selected items —
 * optionally dismissible via the "×" button (`onRemove`).
 *
 * Tag is the interactive counterpart to **Badge**: use Badge for read-only
 * status labels, Tag when the element can be removed or disabled. Colors bind
 * to the same component/status/* tokens as Badge so the two never drift.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'neutral',
      onRemove,
      removeLabel = 'Remove',
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cx(styles.tag, disabled ? styles.disabled : styles[variant], className)}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel}
        >
          <CrossIcon />
        </button>
      )}
    </span>
  )
);

Tag.displayName = 'Tag';
