import { forwardRef } from 'react';
import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Textarea — Lepidus Design System
 *
 * Multi-line "Type Field Box" matching the Figma component (node 4:234).
 * Three visual states map to native interaction:
 *   - default  → component/textarea/{bg,text,placeholder,border}
 *   - typing   → :focus-within swaps to component/textarea/active-{bg,text,border}
 *   - disabled → component/textarea/disabled-{bg,text,border}
 *
 * Shape (15px card radius, 20px padding, 16/22 body type) uses shared radius /
 * space / typography tokens. Token chain: Primitive → Semantic → Component.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      disabled = false,
      fullWidth = false,
      placeholder = 'Type Description here',
      rows = 6,
      className,
      textareaClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cx(
          styles.box,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          className
        )}
      >
        <textarea
          ref={ref}
          className={cx(styles.textarea, textareaClassName)}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
