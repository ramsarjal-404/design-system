import { type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';

export interface BreadcrumbItem {
  /** Crumb text (or custom node) shown in the trail */
  label: ReactNode;
  /** Renders the crumb as an anchor */
  href?: string;
  /** Renders the crumb as a button when no href is given */
  onClick?: MouseEventHandler<HTMLElement>;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Trail in order — the last item is the current page (not a link) */
  items: BreadcrumbItem[];
  /** Separator between crumbs (default "/", bold, in the crumb color) */
  separator?: ReactNode;
}
