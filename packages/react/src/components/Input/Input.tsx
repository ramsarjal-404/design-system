import { forwardRef, useId, type CSSProperties } from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Input — Lepidus Design System
 *
 * Driven entirely by the canonical Figma component/input/* tokens:
 *   - bg #FFFFFF, border #C7C7C7, radius 25px (pill), text #364765
 *   - label #555766, placeholder #727171, padding 12/20, font 14/19
 *   - focus → bg #E1EAFD + border #1C4599
 *   - disabled → bg #C6C6C6
 *
 * Label layout: left (inline, Figma form default) | top (stacked).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelPosition = 'left',
      labelWidth,
      status = 'default',
      helperText,
      errorMessage,
      disabled = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      style,
      inputClassName,
      id,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const message = status === 'error' ? errorMessage ?? helperText : helperText;
    const messageId = message ? `${inputId}-message` : undefined;
    const hasLabel = label != null && label !== '';
    const isLeft = hasLabel && labelPosition === 'left';

    const wrapperStyle =
      labelWidth != null
        ? ({
            ...style,
            ['--component-input-label-width' as string]:
              typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth,
          } as CSSProperties)
        : style;

    const field = (
      <div
        className={cx(
          styles.field,
          status === 'error' && styles.error,
          disabled && styles.disabled
        )}
      >
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cx(styles.input, inputClassName)}
          disabled={disabled}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={messageId}
          {...props}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
    );

    return (
      <div
        className={cx(styles.wrapper, fullWidth && styles.fullWidth, className)}
        style={wrapperStyle}
      >
        <div className={cx(styles.row, isLeft ? styles.rowLeft : styles.rowTop)}>
          {hasLabel && (
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
          )}
          {field}
        </div>

        {message && (
          <span
            id={messageId}
            className={cx(
              styles.message,
              isLeft && styles.messageIndent,
              status === 'error' && styles.errorMessage
            )}
          >
            {message}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
