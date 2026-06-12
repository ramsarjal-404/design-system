import { type HTMLAttributes, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  /** Controlled active tab id */
  value?: string;
  /** Uncontrolled initial tab id (defaults to the first enabled tab) */
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Prefix for the generated tab/panel ids — pair panels with id={`${idPrefix}-panel-${tab.id}`} */
  idPrefix?: string;
}
