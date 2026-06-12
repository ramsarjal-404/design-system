import { type HTMLAttributes, type ReactNode } from 'react';

export type TagVariant = 'error' | 'success' | 'warning' | 'neutral';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status color set — binds to the shared component/status tokens */
  variant?: TagVariant;
  /** Render the dismiss "×" button and call back when it's activated */
  onRemove?: () => void;
  /** Accessible label for the dismiss button (default "Remove") */
  removeLabel?: string;
  /** Gray out the tag and block dismissal */
  disabled?: boolean;
  /** Tag label */
  children: ReactNode;
}
