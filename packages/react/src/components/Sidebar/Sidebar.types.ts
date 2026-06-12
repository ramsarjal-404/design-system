import { type HTMLAttributes, type ReactNode } from 'react';

export interface SidebarItem {
  /** Stable key */
  key: string;
  /** Item label shown under the icon */
  label: ReactNode;
  /** Icon node (inherits color via currentColor) */
  icon: ReactNode;
  /** Active/selected item — white square + item-active-text icon */
  active?: boolean;
  /** Disabled item */
  disabled?: boolean;
  /** Render as a link */
  href?: string;
  /** Click handler (renders a button when no href) */
  onClick?: () => void;
}

export type SidebarVariant = 'default' | 'rounded';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Rail shape — 'default' (square rail) or 'rounded' (capsule rail, Figma node 557:382) */
  variant?: SidebarVariant;
  /** Navigation items */
  items: SidebarItem[];
  /** Top slot (e.g. product logo) */
  header?: ReactNode;
  /** Bottom slot (e.g. settings + avatar), pinned to the bottom */
  footer?: ReactNode;
  /** Rail width (default 100px; the rounded variant defaults to 85px, matching Figma) */
  width?: number | string;
  /** Accessible label for the nav landmark */
  ariaLabel?: string;
}
