import { forwardRef } from 'react';
import type { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Badge — Lepidus Design System
 *
 * Pill label driven by component tokens:
 *   - shape / type: component/badge/* (radius 28px, 12px, padding 5/15)
 *   - default variant colors: component/badge/{bg,text}
 *   - status variants: component/status/{success,warning,error,na}-{bg,text}
 *
 * Variants: default | success | warning | error | neutral
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', dot = false, icon, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cx(styles.badge, styles[variant], className)}
        {...props}
      >
        {icon ? (
          <span className={styles.icon}>{icon}</span>
        ) : dot ? (
          <span className={styles.dot} aria-hidden="true" />
        ) : null}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
