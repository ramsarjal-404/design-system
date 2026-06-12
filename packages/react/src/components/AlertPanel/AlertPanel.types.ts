import { type HTMLAttributes, type ReactNode } from 'react';

export type AlertPanelSeverity = 'warning' | 'success' | 'error' | 'info';

export interface AlertPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Colors the triangle: warning (yellow), success (green), error (red), info (brand) */
  severity?: AlertPanelSeverity;
  /** Big headline under the triangle (default "Attention!") */
  headline?: ReactNode;
  /** The alert name (e.g. "Mass files copied") */
  title: ReactNode;
  /** Rich summary — use <strong> for the inline facts ("5 change(s)", "File Server") */
  children?: ReactNode;
  /** Evidence area between summary and action (e.g. a small details table) */
  details?: ReactNode;
  /** Call to action (e.g. a primary Button "View Report") */
  action?: ReactNode;
  /** Small line under the action ("Now you can check the report directly…") */
  footnote?: ReactNode;
}
