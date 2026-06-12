import { type ReactNode } from 'react';

/** One applied condition: "{field} {criteria} [values]" */
export interface FilterCondition {
  field: string;
  criteria: string;
  values: string[];
}

export interface FilterField {
  /** Field id — referenced by FilterCondition.field */
  id: string;
  /** Label in the field selector (defaults to id) */
  label?: string;
  /** Values offered as checkboxes in the criteria card */
  values: string[];
}

export interface FilterProps {
  /** Show the drawer */
  open: boolean;
  /** Filterable fields with their candidate values */
  fields: FilterField[];
  /** Conditions shown when the drawer opens (the committed state) */
  conditions?: FilterCondition[];
  /** Criteria offered per condition */
  criteriaOptions?: string[];
  /** Drawer heading (default "Modify Filters") */
  title?: ReactNode;
  /** Drawer width in px (default 420) */
  width?: number;
  /** Footer Apply — receives the full drafted condition list */
  onApply?: (conditions: FilterCondition[]) => void;
  /** Footer Cancel / Escape — discard the draft and close */
  onCancel?: () => void;
  className?: string;
}

/** Filter a list with applied conditions. `getValue` maps an item + field id to its value. */
export function applyFilterConditions<T>(
  items: T[],
  conditions: FilterCondition[],
  getValue: (item: T, fieldId: string) => string
): T[] {
  return items.filter((item) =>
    conditions.every((c) => {
      if (c.values.length === 0 || c.values[0] === 'All') return true;
      const value = getValue(item, c.field);
      if (c.criteria === 'Not Equals') return !c.values.includes(value);
      if (c.criteria === 'Contains') return c.values.some((v) => value.includes(v));
      return c.values.includes(value);
    })
  );
}
