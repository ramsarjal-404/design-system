import { type ButtonHTMLAttributes } from 'react';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  /** Controlled on/off state */
  checked?: boolean;
  /** Uncontrolled initial state (default false) */
  defaultChecked?: boolean;
  /** Called with the next state when the user flips the switch */
  onChange?: (checked: boolean) => void;
  /** Disabled state — Figma "Disabled on" / "Disabled Off" variants */
  disabled?: boolean;
}
