import { forwardRef, useState } from 'react';
import type { ToggleProps } from './Toggle.types';
import styles from './Toggle.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Toggle — Lepidus Design System
 *
 * On/off switch matching the Figma "Toggle" component (node 9:24): a 56×20
 * pill track with a sliding white thumb. Four variants map to checked ×
 * disabled — on (brand blue), off (light blue), and the gray disabled pair.
 *
 * Renders a native <button role="switch" aria-checked>; flip with click,
 * Space or Enter. Works uncontrolled (defaultChecked) or controlled
 * (checked + onChange). Label it with aria-label or an external <label> via
 * aria-labelledby — the switch itself is text-free.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { checked, defaultChecked = false, onChange, disabled = false, className, ...props },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = checked ?? internalChecked;

    const handleClick = () => {
      const next = !isChecked;
      if (checked === undefined) setInternalChecked(next);
      onChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleClick}
        className={cx(styles.toggle, isChecked && styles.on, className)}
        {...props}
      >
        <span className={styles.thumb} />
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
