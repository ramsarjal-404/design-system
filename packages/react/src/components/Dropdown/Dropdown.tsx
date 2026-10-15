import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '../Button';
import type { DropdownOption, DropdownProps } from './Dropdown.types';
import styles from './Dropdown.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ChevronIcon = () => (
  <svg
    className={styles.chevron}
    viewBox="0 0 12 7"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M1 1.5 6 5.5 11 1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function toArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function optionLabel(opt: DropdownOption): ReactNode {
  return opt.label ?? opt.value;
}

/**
 * Dropdown — Lepidus Design System
 *
 * Select / multi-select matching the Figma "DropDown" component (node 49:118).
 * Variants are expressed through props:
 *   - multiple        → option rows gain leading checkboxes
 *   - showButtons      → panel gains a Cancel / Apply footer (draft-then-apply)
 *   - disabled         → component/dropdown/disabled-* tokens
 *
 * Colors come from component/dropdown/* (trigger, header, option, checkbox);
 * the footer reuses the system <Button>. Token chain: Primitive → Semantic →
 * Component.
 */
export function Dropdown({
  options,
  value,
  defaultValue,
  multiple = false,
  showButtons = false,
  placeholder = 'Select',
  disabled = false,
  fullWidth = false,
  onChange,
  onApply,
  onCancel,
  className,
}: DropdownProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(toArray(defaultValue));
  const selected = isControlled ? toArray(value) : internal;

  const [open, setOpen] = useState(false);
  // draft selection used while the buttoned panel is open
  const [draft, setDraft] = useState<string[]>(selected);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const usesDraft = multiple && showButtons;
  const working = usesDraft ? draft : selected;

  // sync draft whenever we (re)open or the committed selection changes
  useEffect(() => {
    if (open) setDraft(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(multiple ? next : (next[0] ?? ''));
  };

  const handleSelect = (opt: DropdownOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const next = working.includes(opt.value)
        ? working.filter((v) => v !== opt.value)
        : [...working, opt.value];
      if (usesDraft) {
        setDraft(next);
      } else {
        commit(next);
      }
    } else {
      commit([opt.value]);
      setOpen(false);
    }
  };

  const triggerText =
    selected.length === 0
      ? placeholder
      : options
          .filter((o) => selected.includes(o.value))
          .map((o) => o.label ?? o.value)
          .join(', ') || placeholder;

  return (
    <div ref={rootRef} className={cx(styles.wrapper, fullWidth && styles.fullWidth, className)}>
      <button
        type="button"
        className={cx(
          styles.trigger,
          disabled && styles.disabled,
          open && !disabled && styles.triggerHidden
        )}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className={styles.triggerLabel}>{triggerText}</span>
        <ChevronIcon />
      </button>

      {open && !disabled && (
        <div className={styles.panel} role="listbox" aria-multiselectable={multiple}>
          <div
            className={styles.header}
            onClick={() => setOpen(false)}
            role="button"
            tabIndex={-1}
          >
            <span className={styles.headerLabel} id={labelId}>
              {placeholder}
            </span>
            <ChevronIcon />
          </div>

          <div className={styles.list}>
            {options.map((opt) => {
              const checked = working.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={styles.option}
                  role="option"
                  aria-selected={checked}
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt)}
                >
                  {multiple && (
                    <span className={styles.checkbox} aria-hidden="true">
                      {checked && <CheckIcon />}
                    </span>
                  )}
                  <span className={styles.optionLabel}>{optionLabel(opt)}</span>
                </button>
              );
            })}
          </div>

          {usesDraft && (
            <div className={styles.footer}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setOpen(false);
                  onCancel?.();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  commit(draft);
                  onApply?.(draft);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Dropdown.displayName = 'Dropdown';
