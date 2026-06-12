import { forwardRef } from 'react';
import type { TextFieldProps } from './TextField.types';
import styles from './TextField.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * TextField — Lepidus Design System
 *
 * Standalone pill text field matching the Figma "Type Text Field" component
 * (node 45:504). Three visual states map to native interaction:
 *   - normal   → component/textfield/{bg,text,border}
 *   - active   → :focus-within swaps to component/textfield/active-{bg,text,border}
 *   - disabled → component/textfield/disabled-{bg,text}
 *
 * Shape (44px pill, 14px padding, 16/22 body type) uses shared radius / space /
 * typography tokens. Token chain: Primitive → Semantic → Component.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      disabled = false,
      fullWidth = false,
      placeholder = 'Type text',
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cx(
          styles.field,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          className
        )}
      >
        <input
          ref={ref}
          className={cx(styles.input, inputClassName)}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);

TextField.displayName = 'TextField';
