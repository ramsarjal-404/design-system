import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'white';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant — maps 1:1 to Figma component tokens */
  variant?: ButtonVariant;
  /** Size — sm (compact, dense UI like table rows), md (regular) or lg (with-icon) */
  size?: ButtonSize;
  /** Disabled state — uses component/button/disabled tokens */
  disabled?: boolean;
  /** Left icon slot */
  iconLeft?: ReactNode;
  /** Right icon slot */
  iconRight?: ReactNode;
  /** Full-width button */
  fullWidth?: boolean;
  /** Button label */
  children: ReactNode;
}
