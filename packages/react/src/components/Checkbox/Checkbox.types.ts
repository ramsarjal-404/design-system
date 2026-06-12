import { type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  /** Controlled checked state. Pair with `onChange`. */
  checked?: boolean;
  /** Uncontrolled initial state (default false). */
  defaultChecked?: boolean;
  /**
   * Called with the next checked state when the user toggles the box.
   * The raw change event is passed as the second argument.
   */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Indeterminate ("mixed") state — shown as a dash glyph and exposed to
   * assistive tech as `aria-checked="mixed"`. Set from a parent that tracks
   * a partially-selected group; clears on the next user toggle.
   */
  indeterminate?: boolean;
  /** Disabled state — gray box and label, interaction blocked. */
  disabled?: boolean;
  /**
   * Visible label rendered inside a real `<label>` wrapper, so clicking the
   * text toggles the box. Without it, name the control with `aria-label`.
   */
  label?: ReactNode;
  /** Error state — the box border uses the status-error token. */
  error?: boolean;
  /** Extra class on the root `<label>` wrapper. */
  className?: string;
}
