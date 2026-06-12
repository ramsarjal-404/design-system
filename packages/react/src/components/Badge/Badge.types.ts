import { type HTMLAttributes, type ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant — default (brand) uses component/badge tokens; the rest use component/status tokens */
  variant?: BadgeVariant;
  /** Show a leading status dot (uses the variant text color) */
  dot?: boolean;
  /** Leading icon slot (replaces the dot if both are set) */
  icon?: ReactNode;
  /** Badge label */
  children: ReactNode;
}
