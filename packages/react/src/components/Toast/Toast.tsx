import { forwardRef, isValidElement } from 'react';
import type { ToastProps, ToastVariant } from './Toast.types';
import styles from './Toast.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

/** Per-variant glyph drawn inside the circular badge. */
function BadgeGlyph({ variant }: { variant: ToastVariant }) {
  if (variant === 'success') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  // info → "i"; warning / error → "!"
  const mark = variant === 'info' ? 'i' : '!';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Open Sans, system-ui, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="currentColor"
      >
        {mark}
      </text>
    </svg>
  );
}

/**
 * Toast — Lepidus Design System
 *
 * Notification pill matching the Figma "Info" component (node 4:356): a circular
 * status badge, bold title + message line, and a close button on a white→accent
 * gradient pill with a brand border and drop shadow.
 *
 * Structure binds to component/toast/* (badge, border, gradient, title, body,
 * close); success / warning / error swap the accent to component/status/*.
 * Token chain: Primitive → Semantic → Component.
 *
 * Variants: info | success | warning | error.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { variant = 'info', title, children, icon = true, onClose, className, ...props },
    ref
  ) => {
    const showIcon = icon !== false;
    const customIcon = isValidElement(icon) ? icon : null;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cx(styles.toast, styles[variant], className)}
        {...props}
      >
        {showIcon && (
          <span className={styles.badge}>
            {customIcon ?? <BadgeGlyph variant={variant} />}
          </span>
        )}

        <div className={styles.content}>
          {title && <p className={styles.title}>{title}</p>}
          {children != null && <p className={styles.body}>{children}</p>}
        </div>

        {onClose && (
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
