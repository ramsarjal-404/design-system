import { Fragment, forwardRef, useEffect, useId, useRef, type MouseEvent } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import type { ModalProps } from './Modal.types';
import styles from './Modal.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Modal — Lepidus Design System
 *
 * Popup surface (Figma node 658:10178 "URL Popup"): a tinted shell with a white,
 * brand-titled header bar, a body that holds one or more inputs + custom content,
 * and a centered footer of actions. Reuses the Lepidus **Input** and **Button**.
 *
 * Token bindings (see Modal.module.css): backdrop `component/modal/overlay`,
 * shell `color/background/page`, radius `radius/input`, header `component/modal/bg`,
 * title `color/text/brand` + `typography/nav`.
 *
 * Variables: open · size (sm/md/lg) · headerAlign (center/left) · overlay ·
 * closeOnOverlayClick · closeOnEsc · fields[] (multiple inputs) · primary/secondaryAction.
 *
 * Focus management (overlay mode): on open, focus moves to the first focusable
 * element in the dialog (or the shell); Tab/Shift+Tab cycle inside it; on close,
 * focus returns to the element that opened it.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open = true,
      title,
      headerAlign = 'center',
      size = 'md',
      overlay = true,
      onClose,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      fields,
      children,
      primaryAction,
      secondaryAction,
      className,
      ...props
    },
    ref
  ) => {
    const titleId = useId();
    const shellRef = useRef<HTMLDivElement | null>(null);
    const setShellRef = (node: HTMLDivElement | null) => {
      shellRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (!open || !overlay) return;
      const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const shell = shellRef.current;
      (shell?.querySelector<HTMLElement>(FOCUSABLE) ?? shell)?.focus();

      const onTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !shellRef.current) return;
        const nodes = Array.from(shellRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) {
          e.preventDefault();
          shellRef.current.focus();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === shellRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onTab, true);
      return () => {
        document.removeEventListener('keydown', onTab, true);
        previous?.focus();
      };
    }, [open, overlay]);

    useEffect(() => {
      if (!open || !overlay || !closeOnEsc || !onClose) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open, overlay, closeOnEsc, onClose]);

    if (!open) return null;

    const hasFields = Array.isArray(fields) && fields.length > 0;
    const hasFooter = Boolean(primaryAction || secondaryAction);

    const shell = (
      <div
        ref={setShellRef}
        role="dialog"
        aria-modal={overlay || undefined}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cx(styles.shell, styles[size], !overlay && styles.inline, className)}
        {...props}
      >
        {title && (
          <div className={cx(styles.header, headerAlign === 'left' ? styles.headerLeft : styles.headerCenter)}>
            <p id={titleId} className={styles.title}>
              {title}
            </p>
          </div>
        )}

        <div className={styles.body}>
          {hasFields && (
            <div className={styles.fields}>
              {fields!.map((field, i) => {
                /* Render the label and field as grid cells so the label column
                   auto-sizes to the widest label (tight, consistent gap; inputs
                   stay aligned). Input renders without its own fixed-width label. */
                const { key, label, labelPosition, labelWidth, id, ...inputProps } = field;
                const fieldId = id ?? `${titleId}-f${i}`;
                const hasLabel = label != null && label !== '';
                return (
                  <Fragment key={key ?? i}>
                    {hasLabel ? (
                      <label htmlFor={fieldId} className={styles.fieldLabel}>
                        {label}
                      </label>
                    ) : (
                      <span aria-hidden className={styles.fieldLabelEmpty} />
                    )}
                    <Input id={fieldId} fullWidth {...inputProps} />
                  </Fragment>
                );
              })}
            </div>
          )}

          {children != null && <div className={styles.custom}>{children}</div>}

          {hasFooter && (
            <div className={styles.footer}>
              {secondaryAction && (
                <Button
                  variant="secondary"
                  disabled={secondaryAction.disabled}
                  onClick={secondaryAction.onClick ?? onClose}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button variant="primary" disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );

    if (!overlay) return shell;

    const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
    };

    return (
      <div className={styles.overlay} onClick={onOverlayClick}>
        {shell}
      </div>
    );
  }
);

Modal.displayName = 'Modal';
