import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '../Button';
import type { CalendarProps, CalendarVariant } from './Calendar.types';
import { CalendarGlyph, ChevronDown } from './calendarIcons';
import styles from './Calendar.module.css';

function cx(...c: (string | false | undefined | null)[]): string {
  return c.filter(Boolean).join(' ');
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pad2 = (n: number) => String(n).padStart(2, '0');
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

type Option = { value: string; label: string };

/* ---------- Lepidus popover dropdown (custom panel rather than the native
   <select>, so the open list uses system tokens instead of the OS menu) ---------- */
function Dropdown({
  tone, value, onChange, options, leadingIcon, placeholder, ariaLabel,
}: {
  tone: 'brand' | 'plain';
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  leadingIcon?: ReactNode;
  placeholder?: string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className={styles.dropdownWrap} ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cx(styles.dropdown, tone === 'brand' ? styles.brandDropdown : styles.plainDropdown)}
        onClick={() => setOpen((o) => !o)}
      >
        {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
        <span className={cx(styles.dropdownValue, !current && styles.placeholder)}>
          {current ? current.label : placeholder}
        </span>
        <span className={styles.chevron}><ChevronDown /></span>
      </button>

      {open && (
        <div className={styles.panel} role="listbox" aria-label={ariaLabel}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className={cx(styles.option, o.value === value && styles.optionSelected)}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- chip multi-select with popover ---------- */
function MultiSelect({
  options, selected, onToggle, placeholder, round, ariaLabel,
}: {
  options: { value: number; label: string }[];
  selected: number[];
  onToggle: (v: number) => void;
  placeholder: string;
  round?: boolean;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const labelFor = (v: number) => options.find((o) => o.value === v)?.label ?? String(v);

  return (
    <div className={styles.multi} ref={ref}>
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={styles.multiField}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); }
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className={styles.multiChips}>
          {selected.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            selected.map((v) => (
              <button
                key={v}
                type="button"
                className={cx(styles.chip, round && styles.chipRound)}
                onClick={(e) => { e.stopPropagation(); onToggle(v); }}
                aria-label={`Remove ${labelFor(v)}`}
              >
                {labelFor(v)}
              </button>
            ))
          )}
        </div>
        <span className={styles.multiChevron}><ChevronDown /></span>
      </div>

      {open && (
        <div className={styles.panel}>
          {round ? (
            <div className={styles.panelGrid}>
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cx(styles.option, styles.optionDate, selected.includes(o.value) && styles.optionSelected)}
                  onClick={() => onToggle(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : (
            options.map((o) => (
              <button
                key={o.value}
                type="button"
                className={cx(styles.option, selected.includes(o.value) && styles.optionSelected)}
                onClick={() => onToggle(o.value)}
              >
                {o.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- month grid ---------- */
function MonthGrid({
  year, month, selected, onSelect, marked,
}: {
  year: number;
  month: number;
  selected: number | null;
  onSelect: (d: number) => void;
  marked: Set<number>;
}) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={styles.grid} role="grid" aria-label={`${MONTHS[month]} ${year}`}>
      {cells.map((d, i) =>
        d === null ? (
          <span key={`e${i}`} className={cx(styles.day, styles.dayEmpty)} aria-hidden="true" />
        ) : (
          <button
            key={d}
            type="button"
            className={cx(
              styles.day,
              isThisMonth && today.getDate() === d && d !== selected && styles.dayToday,
              d === selected && styles.daySelected
            )}
            aria-pressed={d === selected}
            onClick={() => onSelect(d)}
          >
            {d}
            {marked.has(d) && <span className={styles.eventDot} aria-label="has event" />}
          </button>
        )
      )}
    </div>
  );
}

/**
 * Calendar — Lepidus Design System
 *
 * Schedule picker (Figma 124:734 / 124:906 / 124:1088): a titled card with a
 * Start-On month/year picker, an interactive month grid, a Start-At H/M/S time
 * picker, and — by frequency — weekday and date multi-selects, plus Cancel/Done.
 *
 * Token bindings (see Calendar.module.css): day text `component/calendar/day-text`,
 * selected `component/calendar/selected-bg`+`/selected-text`, today
 * `component/calendar/today-border`, chips `color/button/secondary/bg`,
 * brand dropdown `color/brand/primary`. Reuses **Button**.
 *
 * Variants: daily | weekly | monthly.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      variant = 'daily',
      title,
      defaultMonth,
      defaultYear,
      defaultSelectedDate,
      yearRange = [-5, 5],
      markedDates,
      onSelectDate,
      onCancel,
      onDone,
      className,
      ...props
    },
    ref
  ) => {
    const now = new Date();
    const [month, setMonth] = useState(defaultMonth ?? now.getMonth());
    const [year, setYear] = useState(defaultYear ?? now.getFullYear());
    const [selected, setSelected] = useState<number | null>(defaultSelectedDate ?? null);
    const [time, setTime] = useState<{ h: number | null; m: number | null; s: number | null }>({
      h: null, m: null, s: null,
    });
    const [weekdays, setWeekdays] = useState<number[]>([]);
    const [dates, setDates] = useState<number[]>([]);

    const heading = title ?? `${cap(variant)} Schedule`;
    const showWeekdays = variant === 'weekly' || variant === 'monthly';
    const showDates = variant === 'monthly';
    const years = range(now.getFullYear() + yearRange[0], now.getFullYear() + yearRange[1]);

    const toggle = (set: typeof setWeekdays, v: number) =>
      set((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v].sort((a, b) => a - b)));

    const timeSelect = (label: string, key: 'h' | 'm' | 's', count: number) => (
      <Dropdown
        tone="plain"
        ariaLabel={key === 'h' ? 'Hour' : key === 'm' ? 'Minute' : 'Second'}
        placeholder={label}
        value={time[key] == null ? '' : String(time[key])}
        options={range(0, count - 1).map((n) => ({ value: String(n), label: pad2(n) }))}
        onChange={(v) => setTime((t) => ({ ...t, [key]: Number(v) }))}
      />
    );

    return (
      <div ref={ref} role="dialog" aria-label={heading} className={cx(styles.card, className)} {...props}>
        <div className={styles.header}>
          <h2 className={styles.title}>{heading}</h2>
        </div>

        <div className={styles.body}>
          {/* Start On */}
          <div className={styles.row}>
            <span className={styles.rowLabel}>Start On</span>
            <div className={styles.rowControls}>
              <Dropdown
                tone="brand"
                ariaLabel="Month"
                leadingIcon={<CalendarGlyph />}
                value={String(month)}
                options={MONTHS.map((m, i) => ({ value: String(i), label: m }))}
                onChange={(v) => setMonth(Number(v))}
              />
              <Dropdown
                tone="brand"
                ariaLabel="Year"
                leadingIcon={<CalendarGlyph />}
                value={String(year)}
                options={years.map((y) => ({ value: String(y), label: String(y) }))}
                onChange={(v) => setYear(Number(v))}
              />
            </div>
          </div>

          {/* Month grid */}
          <MonthGrid
            year={year}
            month={month}
            selected={selected}
            marked={new Set(markedDates ?? [])}
            onSelect={(d) => {
              setSelected(d);
              onSelectDate?.({ year, month, day: d });
            }}
          />

          {/* Start At */}
          <div className={styles.row}>
            <span className={styles.rowLabel}>Start At</span>
            <div className={styles.rowControls}>
              {timeSelect('H', 'h', 24)}
              {timeSelect('M', 'm', 60)}
              {timeSelect('S', 's', 60)}
            </div>
          </div>

          {/* Select Month (weekday chips) — label matches the Figma frame */}
          {showWeekdays && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Select Month</span>
              <MultiSelect
                ariaLabel="Select weekdays"
                placeholder="Select weekdays"
                options={WEEKDAYS.map((w, i) => ({ value: i, label: w }))}
                selected={weekdays}
                onToggle={(v) => toggle(setWeekdays, v)}
              />
            </div>
          )}

          {/* Select Date (date chips) */}
          {showDates && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Select Date</span>
              <MultiSelect
                round
                ariaLabel="Select dates"
                placeholder="Select dates"
                options={range(1, 31).map((d) => ({ value: d, label: String(d) }))}
                selected={dates}
                onToggle={(v) => toggle(setDates, v)}
              />
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer}>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => onDone?.({ year, month, day: selected, time, weekdays, dates })}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export type { CalendarVariant };
