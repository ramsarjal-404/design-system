import { forwardRef } from 'react';
import type { EmptyStateProps } from './EmptyState.types';
import { EmptyStateIllustration } from './EmptyStateIllustration';
import styles from './EmptyState.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * EmptyState — Lepidus Design System
 *
 * "Empty Page Statement with Illustration" matching the Figma frame (node
 * 133:263): the sleeping-server line art centered above a brand-blue 16px
 * statement. Use it wherever a region has nothing to show — empty tables,
 * no search results, nothing to download — and pass `action` when there is
 * an obvious next step.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ message, illustration, illustrationSize = 221, action, className, ...props }, ref) => (
    <div ref={ref} className={cx(styles.emptyState, className)} {...props}>
      <div className={styles.illustration}>
        {illustration ?? <EmptyStateIllustration size={illustrationSize} />}
      </div>
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
);

EmptyState.displayName = 'EmptyState';
