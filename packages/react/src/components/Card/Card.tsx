import { forwardRef } from 'react';
import type { CardProps } from './Card.types';
import styles from './Card.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Card — Lepidus Design System
 *
 * Surface container driven by component/card/* tokens:
 *   bg #EDF3FC, border #C7C7C7, radius 15px, padding 20px, gap 24px,
 *   title-text #364765, body-text #555766. `elevated` uses shadow-card/*.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { title, actions, footer, elevated = false, borderless = false, children, className, ...props },
    ref
  ) => {
    const hasHeader = title != null || actions != null;
    return (
      <div
        ref={ref}
        className={cx(
          styles.card,
          elevated && styles.elevated,
          borderless && styles.borderless,
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div className={styles.header}>
            {title != null && <div className={styles.title}>{title}</div>}
            {actions != null && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
        {children != null && <div className={styles.body}>{children}</div>}
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
