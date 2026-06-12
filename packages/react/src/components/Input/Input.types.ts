import { type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputStatus = 'default' | 'error';
export type InputLabelPosition = 'left' | 'top';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field label. Uses component/input/label token (text-secondary). */
  label?: ReactNode;
  /** Label placement — 'left' (inline, Figma form default) or 'top' (stacked) */
  labelPosition?: InputLabelPosition;
  /** Fixed label column width for labelPosition="left" (default 171px, from Figma) */
  labelWidth?: number | string;
  /** Validation status — 'error' uses the system danger tokens */
  status?: InputStatus;
  /** Helper / hint text below the field (replaced by errorMessage when status="error") */
  helperText?: ReactNode;
  /** Error message — shown below the field when status="error" */
  errorMessage?: ReactNode;
  /** Disabled state — uses component/input/bg-disabled token */
  disabled?: boolean;
  /** Left adornment slot (icon) */
  iconLeft?: ReactNode;
  /** Right adornment slot (icon) */
  iconRight?: ReactNode;
  /** Full-width field */
  fullWidth?: boolean;
  /** Class applied to the outer wrapper */
  className?: string;
  /** Style applied to the outer wrapper */
  style?: CSSProperties;
  /** Class applied to the <input> element itself */
  inputClassName?: string;
}
