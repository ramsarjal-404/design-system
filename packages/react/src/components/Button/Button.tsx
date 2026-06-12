import { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Button — Lepidus Design System
 *
 * Variants: primary | secondary | danger | white
 * Sizes: sm (compact, 5/16 padding — dense UI like table rows) |
 *        md (regular, 12/20 padding) | lg (with-icon, 10/24 padding)
 *
 * All visual properties are driven by component tokens:
 *   component/button/{variant}/{property}
 * which alias to semantic tokens, which alias to primitives.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cx(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        {children}
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
