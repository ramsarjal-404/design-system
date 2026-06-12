import { forwardRef, useState } from 'react';
import type { TimePeriod, TimePickerProps } from './TimePicker.types';
import { ClockGlyph } from '../Calendar/calendarIcons';
import styles from './TimePicker.module.css';

function cx(...c: (string | false | undefined | null)[]): string {
  return c.filter(Boolean).join(' ');
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * TimePicker — Lepidus Design System
 *
 * "Enter Time" picker (Figma node 124:505): editable hour/minute boxes split by
 * a colon, an AM/PM toggle (12-hour mode) and Cancel/OK.
 *
 * Token bindings (see TimePicker.module.css): boxes `color/button/secondary/bg`
 * + `color/text/brand`, colon `color/text/dark`, toggle `component/modal/border`.
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      label = 'Enter Time',
      defaultHour,
      defaultMinute = 0,
      defaultPeriod = 'AM',
      use24Hour = false,
      onCancel,
      onConfirm,
      className,
      ...props
    },
    ref
  ) => {
    const hourMax = use24Hour ? 23 : 12;
    const hourMin = use24Hour ? 0 : 1;
    const [hour, setHour] = useState(pad2(defaultHour ?? (use24Hour ? 9 : 7)));
    const [minute, setMinute] = useState(pad2(defaultMinute));
    const [period, setPeriod] = useState<TimePeriod>(defaultPeriod);

    const commitHour = () => setHour(pad2(clamp(parseInt(hour || '0', 10) || hourMin, hourMin, hourMax)));
    const commitMinute = () => setMinute(pad2(clamp(parseInt(minute || '0', 10) || 0, 0, 59)));

    const onlyDigits = (s: string) => s.replace(/\D/g, '').slice(0, 2);

    const confirm = () => {
      const h = clamp(parseInt(hour || '0', 10) || hourMin, hourMin, hourMax);
      const m = clamp(parseInt(minute || '0', 10) || 0, 0, 59);
      onConfirm?.({ hour: h, minute: m, period: use24Hour ? null : period });
    };

    return (
      <div ref={ref} role="group" aria-label={label} className={cx(styles.card, className)} {...props}>
        <span className={styles.overline}>{label}</span>

        <div className={styles.timeRow}>
          <div className={styles.unit}>
            <input
              className={styles.box}
              aria-label="Hour"
              inputMode="numeric"
              value={hour}
              onChange={(e) => setHour(onlyDigits(e.target.value))}
              onBlur={commitHour}
            />
            <span className={styles.unitLabel}>Hour</span>
          </div>

          <div className={styles.colon} aria-hidden="true">
            <span />
            <span />
          </div>

          <div className={styles.unit}>
            <input
              className={styles.box}
              aria-label="Minute"
              inputMode="numeric"
              value={minute}
              onChange={(e) => setMinute(onlyDigits(e.target.value))}
              onBlur={commitMinute}
            />
            <span className={styles.unitLabel}>Minute</span>
          </div>

          {!use24Hour && (
            <div className={styles.period} role="group" aria-label="AM or PM">
              {(['AM', 'PM'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={cx(styles.periodOption, period === p && styles.periodActive)}
                  aria-pressed={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.clock} aria-hidden="true"><ClockGlyph /></span>
          <button type="button" className={styles.textButton} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.textButton} onClick={confirm}>OK</button>
        </div>
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
