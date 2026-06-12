import { forwardRef } from 'react';
import type { AlertPanelProps } from './AlertPanel.types';
import styles from './AlertPanel.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* Severity colors: status tokens for success/error/info; the warning yellow
   is the icon set's illustrative #FFCA28, which has no token (same as the
   FolderTree folder). The "!" mark is dark on yellow, white otherwise. */
const TRIANGLE_FILL: Record<string, string> = {
  warning: '#ffca28',
  success: 'var(--color-status-success-text, #1caa52)',
  error: 'var(--color-status-error-text, #f72b2b)',
  info: 'var(--color-brand-primary, #1c4599)',
};

const MARK_FILL: Record<string, string> = {
  warning: 'var(--color-text-primary, #364765)',
  success: 'var(--color-icon-on-brand, #ffffff)',
  error: 'var(--color-icon-on-brand, #ffffff)',
  info: 'var(--color-icon-on-brand, #ffffff)',
};

const TriangleIcon = ({ severity }: { severity: string }) => (
  <svg viewBox="0 0 100 92" aria-hidden="true">
    <path
      style={{ fill: TRIANGLE_FILL[severity] }}
      d="M41.5 8.5a10 10 0 0 1 17 0l38 66a10 10 0 0 1-8.5 15h-76a10 10 0 0 1-8.5-15z"
    />
    <rect style={{ fill: MARK_FILL[severity] }} x="45.5" y="30" width="9" height="30" rx="4.5" />
    <circle style={{ fill: MARK_FILL[severity] }} cx="50" cy="72" r="5" />
  </svg>
);

/**
 * AlertPanel — Lepidus Design System
 *
 * Page-level alert announcement matching the Figma frame (node 2290:3737):
 * a severity triangle over the big "Attention!" headline, the alert name,
 * a rich summary, an optional evidence area, a call to action and a
 * footnote — all centered on a soft-shadow card.
 *
 * The heaviest of the three feedback weights: Toast (transient) → Message
 * (inline strip) → AlertPanel (standing announcement). Reconciled to system
 * tokens where the frame drifted: the CTA slot expects the standard primary
 * Button (the frame's one-off cyan is not a system color), and the summary
 * uses body-lg instead of the frame's unscaled 17px.
 */
export const AlertPanel = forwardRef<HTMLDivElement, AlertPanelProps>(
  (
    { severity = 'warning', headline = 'Attention!', title, children, details, action, footnote, className, ...props },
    ref
  ) => (
    <div ref={ref} role="alert" className={cx(styles.panel, className)} {...props}>
      <span className={styles.icon}>
        <TriangleIcon severity={severity} />
      </span>
      <h2 className={styles.headline}>{headline}</h2>
      <p className={styles.title}>{title}</p>
      {children && <div className={styles.summary}>{children}</div>}
      {details && <div className={styles.details}>{details}</div>}
      {action && <div className={styles.action}>{action}</div>}
      {footnote && <p className={styles.footnote}>{footnote}</p>}
    </div>
  )
);

AlertPanel.displayName = 'AlertPanel';
