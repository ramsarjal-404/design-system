import { forwardRef } from 'react';
import type { StepsProps } from './Steps.types';
import styles from './Steps.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const CheckGlyph = () => (
  <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m1 5 3.5 3.5L11 1.5" />
  </svg>
);

/**
 * Steps — Lepidus Design System
 *
 * Wizard progress indicator matching the Figma "Steps" component set (node
 * 736:425): completed steps are solid success-green discs with a white check,
 * the current step is a green ring with a green dot, upcoming steps are gray
 * rings; 52px connectors turn green once crossed, and the "N of M" label
 * trails the dots.
 *
 * State is conveyed by the visible label and `aria-valuenow` on the
 * progressbar role — the dots themselves are decorative. Pass `onStepClick`
 * to make completed steps act as back-navigation.
 */
export const Steps = forwardRef<HTMLDivElement, StepsProps>(
  ({ total, current, showLabel = true, onStepClick, className, ...props }, ref) => {
    const clamped = Math.min(Math.max(current, 1), total);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={clamped}
        aria-valuetext={`Step ${clamped} of ${total}`}
        className={cx(styles.steps, className)}
        {...props}
      >
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const isDone = step < clamped;
          const isCurrent = step === clamped;
          const clickable = isDone && !!onStepClick;
          const circle = (
            <span
              className={cx(
                styles.circle,
                isDone && styles.done,
                isCurrent && styles.current,
                !isDone && !isCurrent && styles.upcoming
              )}
            >
              {isDone && <CheckGlyph />}
              {isCurrent && <span className={styles.dot} />}
            </span>
          );
          return (
            <span key={step} className={styles.item}>
              {clickable ? (
                <button
                  type="button"
                  className={styles.stepButton}
                  aria-label={`Go to step ${step}`}
                  onClick={() => onStepClick?.(step)}
                >
                  {circle}
                </button>
              ) : (
                circle
              )}
              {step < total && (
                <span className={cx(styles.connector, isDone && styles.connectorDone)} />
              )}
            </span>
          );
        })}
        {showLabel && (
          <span className={styles.label}>
            {clamped} of {total}
          </span>
        )}
      </div>
    );
  }
);

Steps.displayName = 'Steps';
