import { type HTMLAttributes, type ReactNode } from 'react';

/** Status variant — drives the badge, border and gradient accent.
 *  - `info`    → brand blue (the Figma instance)
 *  - `success` → component/status/success
 *  - `warning` → component/status/warning
 *  - `error`   → component/status/error */
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Status variant — defaults to `info`. */
  variant?: ToastVariant;
  /** Bold heading (e.g. "Info !"). */
  title?: ReactNode;
  /** Supporting message line. */
  children?: ReactNode;
  /** Show the leading circular badge icon. Pass a node to override the glyph. Default true. */
  icon?: boolean | ReactNode;
  /** When provided, renders a close (×) button wired to this handler. */
  onClose?: () => void;
}
