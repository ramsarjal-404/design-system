import { forwardRef, isValidElement } from 'react';
import { Button } from '../Button';
import type { MessageProps } from './Message.types';
import { StatusGlyph, CloseIcon } from './messageIcons';
import styles from './Message.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Message — Lepidus Design System
 *
 * "Alert Message" surface (Figma node 1212:18): a status icon, title, body and
 * optional action buttons + close. Available in all states.
 *
 * Token bindings (see Message.module.css): surface `component/modal/bg`,
 * radius `component/modal/radius`, title `component/modal/title/text` +
 * `typography/heading/h3`, body `component/modal/body/text` + `typography/nav`,
 * icon tint `color/status/*` (per variant).
 *
 * Variants: info | success | warning | error.
 */
export const Message = forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      variant = 'error',
      title,
      children,
      icon = true,
      primaryAction,
      secondaryAction,
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    const showIcon = icon !== false;
    const customIcon = isValidElement(icon) ? icon : null;
    const hasActions = Boolean(primaryAction || secondaryAction);

    return (
      <div
        ref={ref}
        role="alert"
        className={cx(styles.message, styles[variant], className)}
        {...props}
      >
        {showIcon && (
          <span className={styles.icon}>
            {customIcon ?? <StatusGlyph variant={variant} />}
          </span>
        )}

        <div className={styles.content}>
          <div className={styles.text}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children != null && <div className={styles.body}>{children}</div>}
          </div>

          {hasActions && (
            <div className={styles.actions}>
              {secondaryAction && (
                <Button variant="secondary" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button variant="primary" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
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

Message.displayName = 'Message';
