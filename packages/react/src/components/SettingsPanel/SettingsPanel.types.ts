import { type HTMLAttributes, type ReactNode } from 'react';

export interface SettingsPanelItem {
  id: string;
  label: ReactNode;
  /** 30px leading icon — use the Lepidus icon set (inherits the row color) */
  icon?: ReactNode;
}

export interface SettingsPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
  /** Panel heading (default "Categories") */
  title?: ReactNode;
  items: SettingsPanelItem[];
  /** Controlled active category */
  selectedId?: string;
  /** Uncontrolled initial category */
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
}
