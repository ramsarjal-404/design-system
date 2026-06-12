import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import type { PaginationProps } from './Pagination.types';
import styles from './Pagination.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function clampPage(page: number, totalPages: number): number {
  if (Number.isNaN(page)) return 1;
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

/**
 * Pagination — Lepidus Design System
 *
 * Table pagination bar matching the Figma "Pagination" component (node 4:3).
 * First / Previous disable on the first page; Next / Last disable on the last
 * page — these map to the Figma "right enabled" / "left enabled" / "disabled"
 * states. All visual properties are driven by component tokens:
 *   component/pagination/{bg,text,active-bg,active-text,border}
 * which alias to semantic tokens, which alias to primitives.
 */
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      totalRecords,
      currentPage,
      totalPages,
      pageSize,
      pageSizeOptions = [10, 25, 50, 100],
      disabled = false,
      onPageChange,
      onPageSizeChange,
      className,
      ...props
    },
    ref
  ) => {
    const [draftPage, setDraftPage] = useState<string>(String(currentPage));
    const [sizeOpen, setSizeOpen] = useState(false);
    const pageSizeRef = useRef<HTMLSpanElement>(null);

    // keep the input in sync when the page changes from outside the component
    useEffect(() => {
      setDraftPage(String(currentPage));
    }, [currentPage]);

    // close the page-size popover on outside click / Escape
    useEffect(() => {
      if (!sizeOpen) return;
      const onDown = (e: MouseEvent) => {
        if (!pageSizeRef.current?.contains(e.target as Node)) setSizeOpen(false);
      };
      const onKey = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') setSizeOpen(false);
      };
      document.addEventListener('mousedown', onDown);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDown);
        document.removeEventListener('keydown', onKey);
      };
    }, [sizeOpen]);

    const atStart = currentPage <= 1;
    const atEnd = currentPage >= totalPages;

    const goTo = (page: number) => {
      const next = clampPage(page, totalPages);
      if (next !== currentPage) onPageChange?.(next);
    };

    const commitDraft = () => {
      const parsed = clampPage(parseInt(draftPage, 10), totalPages);
      setDraftPage(String(parsed));
      if (parsed !== currentPage) onPageChange?.(parsed);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDraftPage(e.target.value.replace(/[^0-9]/g, ''));
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitDraft();
      }
    };

    return (
      <div
        ref={ref}
        className={cx(styles.pagination, className)}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        <span className={styles.label}>Total Records - {totalRecords}</span>

        <button
          type="button"
          className={styles.button}
          disabled={disabled || atStart}
          onClick={() => goTo(1)}
        >
          First
        </button>
        <button
          type="button"
          className={styles.button}
          disabled={disabled || atStart}
          onClick={() => goTo(currentPage - 1)}
        >
          Previous
        </button>

        <input
          type="text"
          inputMode="numeric"
          className={styles.pageInput}
          value={draftPage}
          disabled={disabled}
          aria-label="Current page"
          onChange={handleInputChange}
          onBlur={commitDraft}
          onKeyDown={handleInputKeyDown}
        />
        <span className={styles.label}>/{totalPages}</span>

        <button
          type="button"
          className={styles.button}
          disabled={disabled || atEnd}
          onClick={() => goTo(currentPage + 1)}
        >
          Next
        </button>
        <button
          type="button"
          className={styles.button}
          disabled={disabled || atEnd}
          onClick={() => goTo(totalPages)}
        >
          Last
        </button>

        <span className={styles.pageSize} ref={pageSizeRef}>
          <button
            type="button"
            className={styles.pageSizeTrigger}
            disabled={disabled}
            aria-label="Rows per page"
            aria-haspopup="listbox"
            aria-expanded={sizeOpen}
            onClick={() => setSizeOpen((o) => !o)}
          >
            {pageSize}/Page
            <svg className={styles.pageSizeChevron} viewBox="0 0 14 7" fill="none" aria-hidden="true">
              <path d="M1 1 7 6 13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {sizeOpen && !disabled && (
            <span className={styles.pageSizePanel} role="listbox" aria-label="Rows per page">
              {pageSizeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={opt === pageSize}
                  className={cx(
                    styles.pageSizeOption,
                    opt === pageSize && styles.pageSizeOptionSelected
                  )}
                  onClick={() => {
                    onPageSizeChange?.(opt);
                    setSizeOpen(false);
                  }}
                >
                  {opt}/Page
                </button>
              ))}
            </span>
          )}
        </span>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
