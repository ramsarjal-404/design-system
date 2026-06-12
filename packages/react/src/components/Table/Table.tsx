import { useMemo, useState, type ReactNode } from 'react';
import type { TableColumn, TableProps, TableSort } from './Table.types';
import styles from './Table.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const SortArrowIcon = () => (
  <svg viewBox="0 0 10 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 1.5v12M1 5.5l4-4 4 4" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="5.25" />
    <path d="M13.25 13.25 9.7 9.7" />
  </svg>
);

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}

const Checkbox = ({ checked, indeterminate = false, onChange, label }: CheckboxProps) => (
  <input
    type="checkbox"
    className={styles.checkbox}
    checked={checked}
    onChange={onChange}
    aria-label={label}
    ref={(el) => {
      if (el) el.indeterminate = !checked && indeterminate;
    }}
  />
);

function columnLabel<T>(col: TableColumn<T>): string {
  return typeof col.header === 'string' ? col.header : col.key;
}

/**
 * Table — Lepidus Design System
 *
 * Data table matching the Figma "Table" component (node 7:959): sortable bold
 * headers on a subtle gray strip with 15px rounded top corners, a per-column
 * search row, optional row selection via checkboxes in the first column, and
 * 43px data rows. Sorting, filtering and selection all work out of the box on
 * the `data` you pass; each is also controllable for server-driven tables.
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  filterRow = true,
  sort,
  defaultSort = null,
  onSortChange,
  filters,
  onFiltersChange,
  emptyMessage = 'No matching records',
  className,
  ...props
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState<TableSort | null>(defaultSort);
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
  const [internalSelected, setInternalSelected] = useState<Array<string | number>>(defaultSelectedKeys);

  const activeSort = sort !== undefined ? sort : internalSort;
  const activeFilters = filters ?? internalFilters;
  const selected = selectedKeys ?? internalSelected;

  const getKey = (row: T, index: number) => (rowKey ? rowKey(row, index) : index);
  const getValue = (row: T, col: TableColumn<T>) =>
    col.value ? col.value(row) : (row as Record<string, unknown>)[col.key];

  const handleSort = (col: TableColumn<T>) => {
    const next: TableSort = {
      columnKey: col.key,
      direction:
        activeSort?.columnKey === col.key && activeSort.direction === 'asc' ? 'desc' : 'asc',
    };
    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const handleFilter = (col: TableColumn<T>, text: string) => {
    const next = { ...activeFilters, [col.key]: text };
    if (filters === undefined) setInternalFilters(next);
    onFiltersChange?.(next);
  };

  const rows = useMemo(() => {
    let entries = data.map((row, index) => ({ row, key: getKey(row, index), index }));

    for (const col of columns) {
      const query = activeFilters[col.key]?.trim().toLowerCase();
      if (!query) continue;
      entries = entries.filter(({ row }) =>
        String(getValue(row, col) ?? '').toLowerCase().includes(query)
      );
    }

    if (activeSort) {
      const col = columns.find((c) => c.key === activeSort.columnKey);
      if (col) {
        const dir = activeSort.direction === 'asc' ? 1 : -1;
        entries = [...entries].sort((a, b) => {
          const va = getValue(a.row, col);
          const vb = getValue(b.row, col);
          if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
          return String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true }) * dir;
        });
      }
    }

    return entries;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, activeFilters, activeSort, rowKey]);

  const allSelected = rows.length > 0 && rows.every(({ key }) => selected.includes(key));
  const someSelected = rows.some(({ key }) => selected.includes(key));

  const updateSelection = (keys: Array<string | number>) => {
    if (selectedKeys === undefined) setInternalSelected(keys);
    onSelectionChange?.(keys);
  };

  const toggleAll = () => {
    const visible = rows.map(({ key }) => key);
    updateSelection(
      allSelected ? selected.filter((k) => !visible.includes(k)) : [...new Set([...selected, ...visible])]
    );
  };

  const toggleRow = (key: string | number) => {
    updateSelection(
      selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
    );
  };

  const renderCell = (row: T, col: TableColumn<T>, rowIndex: number): ReactNode => {
    if (col.render) return col.render(row, rowIndex);
    const value = getValue(row, col);
    return value === undefined || value === null || value === '' ? '-' : String(value);
  };

  return (
    <div className={cx(styles.wrapper, className)} {...props}>
      <table className={styles.table}>
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.key}
              style={col.width !== undefined ? { width: col.width } : undefined}
            />
          ))}
        </colgroup>

        <thead>
          <tr>
            {columns.map((col, i) => {
              const isSorted = activeSort?.columnKey === col.key;
              const sortable = col.sortable !== false;
              const label = (
                <span className={styles.headerLabel}>{col.header}</span>
              );
              return (
                <th
                  key={col.key}
                  className={styles.th}
                  aria-sort={
                    isSorted ? (activeSort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                >
                  <div className={styles.headerInner}>
                    {selectable && i === 0 && (
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                        label="Select all rows"
                      />
                    )}
                    {sortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={() => handleSort(col)}
                      >
                        {label}
                        <span
                          className={cx(
                            styles.sortArrow,
                            isSorted && styles.sortArrowActive,
                            isSorted && activeSort.direction === 'desc' && styles.sortArrowDesc
                          )}
                        >
                          <SortArrowIcon />
                        </span>
                      </button>
                    ) : (
                      label
                    )}
                  </div>
                </th>
              );
            })}
          </tr>

          {filterRow && (
            <tr>
              {columns.map((col) => (
                <td key={col.key} className={styles.filterCell}>
                  {col.filterable !== false && (
                    <div className={styles.filterField}>
                      <input
                        type="text"
                        className={styles.filterInput}
                        value={activeFilters[col.key] ?? ''}
                        onChange={(e) => handleFilter(col, e.target.value)}
                        aria-label={`Search ${columnLabel(col)}`}
                      />
                      <span className={styles.searchIcon}>
                        <SearchIcon />
                      </span>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          )}
        </thead>

        <tbody>
          {rows.map(({ row, key, index }) => {
            const isSelected = selected.includes(key);
            return (
              <tr key={key} className={cx(isSelected && styles.selectedRow)}>
                {columns.map((col, i) => {
                  const content = renderCell(row, col, index);
                  return (
                    <td
                      key={col.key}
                      className={styles.td}
                      style={col.align && col.align !== 'left' ? { textAlign: col.align } : undefined}
                    >
                      <div className={styles.cellInner}>
                        {selectable && i === 0 && (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleRow(key)}
                            label={`Select row ${index + 1}`}
                          />
                        )}
                        <span
                          className={styles.cellText}
                          title={typeof content === 'string' ? content : undefined}
                        >
                          {content}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td className={cx(styles.td, styles.emptyCell)} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = 'Table';
