import { type HTMLAttributes, type ReactNode } from 'react';

export type TableSortDirection = 'asc' | 'desc';

/** Active sort: which column and which direction. */
export interface TableSort {
  columnKey: string;
  direction: TableSortDirection;
}

export interface TableColumn<T> {
  /** Unique column id. Doubles as the row field to read when `render`/`value` are omitted. */
  key: string;
  /** Header label (e.g. "IP Address") */
  header: ReactNode;
  /** Fixed CSS width (number → px). Omit for an evenly flexible column. */
  width?: number | string;
  /** Show the sort arrow and make the header clickable (default true, as in Figma) */
  sortable?: boolean;
  /** Show the search field in the filter row for this column (default true) */
  filterable?: boolean;
  /** Cell text alignment (default left) */
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer. Provide `value` too if the column should stay sortable/filterable. */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Primitive used for sorting and filtering (defaults to `row[key]`) */
  value?: (row: T) => string | number;
}

export interface TableProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Column definitions, in display order */
  columns: TableColumn<T>[];
  /** Row data. Sorting/filtering happen internally unless `sort`/`filters` are controlled. */
  data: T[];
  /** Stable row identity for selection (defaults to the row index) */
  rowKey?: (row: T, index: number) => string | number;
  /** Render selection checkboxes inside the first column (header checkbox selects all) */
  selectable?: boolean;
  /** Controlled selection */
  selectedKeys?: Array<string | number>;
  /** Uncontrolled initial selection */
  defaultSelectedKeys?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Show the per-column search row under the header (default true, as in Figma) */
  filterRow?: boolean;
  /** Controlled sort state (null = unsorted) */
  sort?: TableSort | null;
  /** Uncontrolled initial sort */
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  /** Controlled filter text per column key */
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  /** Shown in a single full-width cell when no rows survive filtering */
  emptyMessage?: ReactNode;
}
