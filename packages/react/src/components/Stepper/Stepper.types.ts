import { type InputHTMLAttributes } from 'react';

export interface StepperProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'size'
  > {
  /** Current value (controlled) */
  value?: number;
  /** Initial value (uncontrolled) */
  defaultValue?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Increment / decrement amount */
  step?: number;
  /** Hide the up / down controls */
  showControls?: boolean;
  /** Disabled state — uses component/stepper/disabled-* tokens */
  disabled?: boolean;
  /** Stretch to fill the container (default fixed 230px from Figma) */
  fullWidth?: boolean;
  /** Fired when the value changes (buttons, typing, or arrow keys) */
  onChange?: (value: number) => void;
  /** Class applied to the outer pill wrapper */
  className?: string;
}
