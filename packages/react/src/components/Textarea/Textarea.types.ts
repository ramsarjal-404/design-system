import { type TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Disabled state — uses component/textarea/disabled-* tokens */
  disabled?: boolean;
  /** Stretch to fill the container width (default fixed 481px from Figma) */
  fullWidth?: boolean;
  /** Class applied to the outer box wrapper */
  className?: string;
  /** Class applied to the inner <textarea> element */
  textareaClassName?: string;
}
