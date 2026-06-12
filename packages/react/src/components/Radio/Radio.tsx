import { createContext, forwardRef, useContext, type ChangeEvent } from 'react';
import type { RadioProps } from './Radio.types';
import styles from './Radio.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  onSelect: (value: string) => void;
}

/** Internal — lets `RadioGroup` wire name/checked/onChange into child `Radio`s. */
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * Radio — Lepidus Design System
 *
 * One-of-many form control: a native `<input type="radio">` visually hidden
 * over a 16px round control with a brand-blue inner dot, reusing the dropdown
 * checkbox token pair for border/fill so selection controls stay consistent.
 * Use it standalone (wire `name`/`checked`/`onChange` yourself) or — usually —
 * inside `RadioGroup`, which handles the wiring and exposes
 * `role="radiogroup"`. Arrow-key movement between options is native browser
 * behavior via the shared `name`.
 *
 * No dedicated Figma frame yet — built token-first; add the frame and node
 * link when designed.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      checked,
      defaultChecked,
      onChange,
      name,
      disabled = false,
      label,
      error = false,
      className,
      ...props
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);

    const resolvedName = name ?? group?.name;
    const resolvedChecked =
      checked ?? (group && value !== undefined ? group.value === value : undefined);
    const resolvedDisabled = disabled || (group?.disabled ?? false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value !== undefined) group?.onSelect(value);
      onChange?.(value ?? event.target.value, event);
    };

    return (
      <label className={cx(styles.root, resolvedDisabled && styles.disabled, className)}>
        <span className={styles.control}>
          <input
            ref={ref}
            type="radio"
            className={styles.input}
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={resolvedDisabled}
            aria-invalid={error || undefined}
            {...props}
          />
          <span className={cx(styles.circle, error && styles.error)} aria-hidden="true">
            <span className={styles.dot} />
          </span>
        </span>
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
