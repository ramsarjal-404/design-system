import { forwardRef, type CSSProperties } from 'react';
import type { BarChartProps } from './Charts.types';
import { chartColor } from './palette';
import { defaultFormat, niceAxisMax, tickValues } from './chartUtils';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * BarChart — Lepidus Design System
 *
 * Horizontal grouped bar chart matching the Figma "Bar Chart 3 Colors
 * Flexible" frame (node 760:1291): category labels down the left, groups of
 * 6px bars with rounded right ends, dashed vertical gridlines and a numeric
 * axis along the bottom. Bar lengths scale to `max` (a "nice" ceiling of the
 * data by default). `stacked` joins each group into one segmented bar sized
 * by the category total.
 */
export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      categories,
      series,
      max,
      ticks = 6,
      labelWidth = 40,
      stacked = false,
      formatValue = defaultFormat,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const dataMax = stacked
      ? Math.max(0, ...categories.map((_, ci) => series.reduce((sum, s) => sum + (s.values[ci] ?? 0), 0)))
      : Math.max(0, ...series.flatMap((s) => s.values));
    const axisMax = max ?? niceAxisMax(dataMax, ticks);
    const axisTicks = tickValues(axisMax, ticks);

    return (
      <div
        ref={ref}
        role="img"
        aria-label={
          ariaLabel ?? `Bar chart of ${series.map((s) => s.name).join(', ')} by ${categories.length} categories`
        }
        className={cx(styles.barChart, className)}
        style={{ '--chart-label-width': `${labelWidth}px` } as CSSProperties}
        {...props}
      >
        <div className={styles.plot}>
          <div className={styles.gridlines} aria-hidden="true">
            {axisTicks.map((_, i) => (
              <span
                key={i}
                className={styles.gridline}
                style={{ left: `${(i / ticks) * 100}%` }}
              />
            ))}
          </div>

          <div className={styles.barRows}>
            {categories.map((category, ci) => (
              <div key={`${category}-${ci}`} className={styles.barRow}>
                <span className={styles.barRowLabel}>{category}</span>
                {stacked ? (
                  <div className={styles.stackedBar}>
                    {series.map((s, si) => {
                      const value = s.values[ci] ?? 0;
                      return (
                        <div
                          key={s.name}
                          className={styles.stackedSegment}
                          title={`${category} — ${s.name}: ${formatValue(value)}`}
                          style={{
                            width: `${Math.min(100, (value / axisMax) * 100)}%`,
                            backgroundColor: chartColor(si, s.color),
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.barGroup}>
                    {series.map((s, si) => {
                      const value = s.values[ci] ?? 0;
                      return (
                        <div
                          key={s.name}
                          className={styles.bar}
                          title={`${category} — ${s.name}: ${formatValue(value)}`}
                          style={{
                            width: `${Math.min(100, (value / axisMax) * 100)}%`,
                            backgroundColor: chartColor(si, s.color),
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.barAxis} aria-hidden="true">
          {axisTicks.map((t, i) => (
            <span key={i} className={styles.barAxisTick} style={{ left: `${(i / ticks) * 100}%` }}>
              {formatValue(t)}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

BarChart.displayName = 'BarChart';
