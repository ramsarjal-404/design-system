import { forwardRef, useId } from 'react';
import type { ProgressProps, ProgressStatus } from './Progress.types';
import styles from './Progress.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

function clampValue(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.min(Math.max(v, 0), 100);
}

/**
 * Progress — Lepidus Design System
 *
 * "Single Status" labeled progress bar matching the Figma component (node 39:7):
 * a status label above a 9px rounded track with a percentage readout.
 * Three states map to the Figma variants:
 *   - in-progress → component/progress/{text,fill,track} (cyan)
 *   - completed   → component/progress/complete-* (status success green, 100%)
 *   - pending     → component/progress/pending-* (disabled gray full bar + clock)
 *
 * status="auto" (default) derives completed when value reaches 100.
 * Token chain: Primitive → Semantic → Component.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      label,
      value = 0,
      status = 'auto',
      showValue = true,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const labelId = useId();
    const clamped = clampValue(value);
    const resolved: Exclude<ProgressStatus, 'auto'> =
      status === 'auto' ? (clamped >= 100 ? 'completed' : 'in-progress') : status;

    const isPending = resolved === 'pending';
    const isCompleted = resolved === 'completed';
    const barValue = isPending ? 100 : isCompleted ? 100 : clamped;

    return (
      <div
        ref={ref}
        className={cx(
          styles.progress,
          isCompleted && styles.completed,
          isPending && styles.pending,
          fullWidth && styles.fullWidth,
          className
        )}
        {...props}
      >
        <span id={labelId} className={styles.label}>{label}</span>

        <div className={styles.row}>
          <div
            className={styles.track}
            role="progressbar"
            aria-labelledby={labelId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isPending ? undefined : barValue}
            aria-valuetext={isPending ? 'Pending' : `${barValue}%`}
          >
            <div className={styles.fill} style={{ width: `${barValue}%` }} />
          </div>

          {isPending ? (
            <span className={styles.clock} title="Pending">
              <ClockIcon />
            </span>
          ) : (
            showValue && <span className={styles.value}>{barValue}%</span>
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
