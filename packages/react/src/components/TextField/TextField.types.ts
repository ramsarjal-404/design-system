import { type InputHTMLAttributes } from 'react';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Disabled state — uses component/textfield/disabled-* tokens */
  disabled?: boolean;
  /** Stretch to fill the container width (default fixed 490px max from Figma) */
  fullWidth?: boolean;
  /** Class applied to the outer pill wrapper */
  className?: string;
  /** Class applied to the inner <input> element */
  inputClassName?: string;
}
