import { type HTMLAttributes } from 'react';

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Total number of records in the dataset (shown as "Total Records - N") */
  totalRecords: number;
  /** Current page, 1-based */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Rows shown per page (drives the "N/Page" selector) */
  pageSize: number;
  /** Options offered in the page-size selector */
  pageSizeOptions?: number[];
  /** Disable the whole control */
  disabled?: boolean;
  /** Fired when the user navigates (First / Previous / Next / Last / page input) */
  onPageChange?: (page: number) => void;
  /** Fired when the user picks a new page size */
  onPageSizeChange?: (pageSize: number) => void;
}
