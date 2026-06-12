import {
  forwardRef,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';
import type { StepperProps } from './Stepper.types';
import styles from './Stepper.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ChevronUp = () => (
  <svg viewBox="0 0 12 7" fill="none" aria-hidden="true">
    <path d="M1 5.5 6 1.5 11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 12 7" fill="none" aria-hidden="true">
    <path d="M1 1.5 6 5.5 11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/**
 * Stepper — Lepidus Design System
 *
 * Number stepper / spinner matching the Figma "Changing Up-down" component
 * (node 391:133): a pill showing a numeric value with stacked up / down
 * controls. Colors come from component/stepper/* (bg, text, border, control,
 * disabled-*); shape uses shared radius / space / typography tokens.
 * Token chain: Primitive → Semantic → Component.
 */
export const Stepper = forwardRef<HTMLInputElement, StepperProps>(
  (
    {
      value,
      defaultValue = 0,
      min = -Infinity,
      max = Infinity,
      step = 1,
      showControls = true,
      disabled = false,
      fullWidth = false,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<number>(
      clamp(defaultValue, min, max)
    );
    const current = isControlled ? (value as number) : internal;

    // keep a free-typed draft so the field can be cleared / partially typed
    const [draft, setDraft] = useState<string>(String(current));
    useEffect(() => {
      setDraft(String(current));
    }, [current]);

    const setValue = (next: number) => {
      const clamped = clamp(next, min, max);
      if (!isControlled) setInternal(clamped);
      if (clamped !== current) onChange?.(clamped);
      setDraft(String(clamped));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDraft(raw);
      const parsed = Number(raw);
      if (raw !== '' && raw !== '-' && !Number.isNaN(parsed)) {
        const clamped = clamp(parsed, min, max);
        if (!isControlled) setInternal(clamped);
        onChange?.(clamped);
      }
    };

    const handleBlur = () => {
      const parsed = Number(draft);
      setValue(Number.isNaN(parsed) || draft === '' ? clamp(0, min, max) : parsed);
    };

    const canDecrement = !disabled && current > min;
    const canIncrement = !disabled && current < max;

    return (
      <div
        className={cx(
          styles.stepper,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          className
        )}
      >
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          aria-label="Value"
          className={styles.input}
          value={draft}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-valuenow={current}
          aria-valuemin={min === -Infinity ? undefined : min}
          aria-valuemax={max === Infinity ? undefined : max}
          {...props}
        />
        {showControls && (
          <span className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              disabled={!canIncrement}
              aria-label="Increment"
              tabIndex={-1}
              onClick={() => setValue(current + step)}
            >
              <ChevronUp />
            </button>
            <button
              type="button"
              className={styles.control}
              disabled={!canDecrement}
              aria-label="Decrement"
              tabIndex={-1}
              onClick={() => setValue(current - step)}
            >
              <ChevronDown />
            </button>
          </span>
        )}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
