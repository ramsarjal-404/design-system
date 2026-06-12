import { forwardRef, useId, useState } from 'react';
import type { RadioGroupProps } from './Radio.types';
import { RadioGroupContext } from './Radio';
import styles from './Radio.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * RadioGroup — Lepidus Design System
 *
 * Helper wrapper for a set of `Radio` options: renders `role="radiogroup"`
 * (labelled via `aria-labelledby` when `label` is given), shares one `name`
 * across the options so native arrow-key movement works, and manages the
 * selected value — controlled (`value` + `onChange`) or uncontrolled
 * (`defaultValue`). Options stack vertically by default; set
 * `orientation="horizontal"` for a row.
 *
 * No dedicated Figma frame yet — built token-first; add the frame and node
 * link when designed.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onChange,
      label,
      orientation = 'vertical',
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = value ?? internalValue;
    const labelId = useId();

    const handleSelect = (next: string) => {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label != null ? labelId : undefined}
        className={cx(styles.group, className)}
        {...props}
      >
        {label != null && (
          <span id={labelId} className={styles.groupLabel}>
            {label}
          </span>
        )}
        <div className={cx(styles.options, orientation === 'horizontal' && styles.horizontal)}>
          <RadioGroupContext.Provider
            value={{ name, value: selectedValue, disabled, onSelect: handleSelect }}
          >
            {children}
          </RadioGroupContext.Provider>
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
