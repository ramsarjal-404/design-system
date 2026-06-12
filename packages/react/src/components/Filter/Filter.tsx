import { useEffect, useState } from 'react';
import type { FilterCondition, FilterProps } from './Filter.types';
import { Dropdown } from '../Dropdown';
import { Button } from '../Button';
import styles from './Filter.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const EditGlyph = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

/**
 * Filter — Lepidus Design System
 *
 * The "Modify Filters" drawer matching the Design Essentials frame (node
 * 369:6362): a right-hand panel with a brand header, a field Dropdown, a
 * Condition button opening the criteria card (criteria Dropdown, value
 * search, checkbox list, Apply disabled until a value is checked), applied
 * conditions as editable cards, and a Cancel/Apply footer.
 *
 * Edits are drafted: nothing reaches the page until the footer Apply fires
 * `onApply(conditions)`; Cancel (or Escape) discards the draft. Pair with the
 * `applyFilterConditions` helper to filter your rows.
 */
export function Filter({
  open,
  fields,
  conditions = [],
  criteriaOptions = ['Equals', 'Not Equals', 'Contains'],
  title = 'Modify Filters',
  width = 420,
  onApply,
  onCancel,
  className,
}: FilterProps) {
  const [draft, setDraft] = useState<FilterCondition[]>(conditions);
  const [field, setField] = useState<string | undefined>();
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [criteria, setCriteria] = useState(criteriaOptions[0]);
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setDraft(conditions);
      setCriteriaOpen(false);
      setField(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const fieldDef = fields.find((f) => f.id === field);
  const fieldLabel = fieldDef?.label ?? fieldDef?.id ?? '';
  const visibleValues = (fieldDef?.values ?? []).filter((v) =>
    v.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openCriteria = (forField: string) => {
    setField(forField);
    const existing = draft.find((f) => f.field === forField);
    setCriteria(existing?.criteria ?? criteriaOptions[0]);
    setChecked(existing && existing.values[0] !== 'All' ? existing.values : []);
    setSearch('');
    setCriteriaOpen(true);
  };

  const applyCriteria = () => {
    const entry: FilterCondition = { field: field as string, criteria, values: checked };
    setDraft((prev) =>
      prev.some((f) => f.field === entry.field)
        ? prev.map((f) => (f.field === entry.field ? entry : f))
        : [...prev, entry]
    );
    setCriteriaOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label={typeof title === 'string' ? title : 'Filters'}
      className={cx(styles.drawer, className)}
      style={{ width }}
    >
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        <Dropdown
          options={fields.map((f) => ({ value: f.id, label: f.label ?? f.id }))}
          placeholder="Select"
          value={field ?? ''}
          onChange={(v) => setField(v as string)}
        />
        <Button variant="primary" fullWidth disabled={!field} onClick={() => field && openCriteria(field)}>
          Condition
        </Button>

        {criteriaOpen && field && (
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>Filter by {fieldLabel}</div>
            <div className={styles.criteriaBody}>
              <p className={styles.criteriaLabel}>Filter Criteria</p>
              <Dropdown
                options={criteriaOptions.map((c) => ({ value: c }))}
                value={criteria}
                onChange={(v) => setCriteria(v as string)}
              />
              <input
                className={styles.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label={`Search ${fieldLabel} values`}
              />
              <div className={styles.valueBox}>
                {visibleValues.map((value) => (
                  <label key={value} className={styles.valueRow}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={checked.includes(value)}
                      onChange={() =>
                        setChecked((prev) =>
                          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
                        )
                      }
                    />
                    {value}
                  </label>
                ))}
                {visibleValues.length === 0 && (
                  <span className={styles.noValues}>No values match "{search}"</span>
                )}
              </div>
              <div className={styles.criteriaFooter}>
                <Button variant="secondary" onClick={() => setCriteriaOpen(false)}>Cancel</Button>
                <Button variant="primary" disabled={checked.length === 0} onClick={applyCriteria}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        {draft.map((f) => {
          const def = fields.find((x) => x.id === f.field);
          return (
            <div key={f.field} className={styles.appliedCard}>
              <div className={styles.appliedHead}>
                <span>{def?.label ?? f.field}</span>
                <button
                  type="button"
                  aria-label={`Edit ${def?.label ?? f.field} filter`}
                  className={styles.editButton}
                  onClick={() => openCriteria(f.field)}
                >
                  <EditGlyph />
                </button>
              </div>
              <span className={styles.appliedValues}>{f.values.join(', ')}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onApply?.(draft)}>Apply</Button>
      </div>
    </div>
  );
}

Filter.displayName = 'Filter';
