import { type HTMLAttributes } from 'react';

export interface StepsProps extends HTMLAttributes<HTMLDivElement> {
  /** Total number of steps */
  total: number;
  /** Current step, 1-based */
  current: number;
  /** Show the "N of M" label after the dots (default true) */
  showLabel?: boolean;
  /** Make completed steps clickable for navigation */
  onStepClick?: (step: number) => void;
}
