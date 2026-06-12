import { type HTMLAttributes, type ReactNode } from 'react';

/** Status of the message — drives the accent / status icon color.
 *  - `info`    → brand blue
 *  - `success` → component/status/success
 *  - `warning` → component/status/warning
 *  - `error`   → component/status/error */
export type MessageVariant = 'info' | 'success' | 'warning' | 'error';

export interface MessageAction {
  label: string;
  onClick?: () => void;
}

export interface MessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Status variant — defaults to `error` (the Figma instance). */
  variant?: MessageVariant;
  /** Bold heading (typography/heading/h3). */
  title?: ReactNode;
  /** Body copy (typography/nav). Pass strings with `\n` or React nodes. */
  children?: ReactNode;
  /** Show the leading status icon. Pass a node to override the default glyph. Default true. */
  icon?: boolean | ReactNode;
  /** Primary (filled) action — rendered with the brand Button. */
  primaryAction?: MessageAction;
  /** Secondary (outline) action. */
  secondaryAction?: MessageAction;
  /** When provided, renders a close (×) button wired to this handler. */
  onClose?: () => void;
}
