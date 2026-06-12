import { forwardRef, useEffect, useRef, type ChangeEvent, type Ref } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const CheckIcon = () => (
  <svg
    className={styles.check}
    viewBox="0 0 10 8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 4.2 3.8 7 9 1" />
  </svg>
);

const DashIcon = () => (
  <svg
    className={styles.dash}
    viewBox="0 0 10 2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M1 1h8" />
  </svg>
);

/**
 * Checkbox — Lepidus Design System
 *
 * Binary form control: a native `<input type="checkbox">` visually hidden
 * over a 16px styled box, reusing the dropdown checkbox token pair
 * (`--component-dropdown-checkbox-border/-fill`) so multi-select surfaces
 * never drift. Works uncontrolled (`defaultChecked`) or controlled
 * (`checked` + `onChange`), supports `indeterminate` ("mixed") for
 * partially-selected groups, `error` for invalid required choices, and a
 * `label` prop that renders a real `<label>` wrapper.
 *
 * No dedicated Figma frame yet — built token-first; add the frame and node
 * link when designed.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
      disabled = false,
      label,
      error = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // The indeterminate state only exists as a DOM property — sync it.
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked, event);
    };

    return (
      <label className={cx(styles.root, disabled && styles.disabled, className)}>
        <span className={styles.control}>
          <input
            ref={mergeRefs(inputRef, ref)}
            type="checkbox"
            className={styles.input}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={indeterminate ? 'mixed' : undefined}
            aria-invalid={error || undefined}
            {...props}
          />
          <span className={cx(styles.box, error && styles.error)} aria-hidden="true">
            <CheckIcon />
            <DashIcon />
          </span>
        </span>
        {label != null && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
