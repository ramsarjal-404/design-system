import { forwardRef } from 'react';
import type { ColumnChartProps } from './Charts.types';
import { chartColor } from './palette';
import { defaultFormat, niceAxisMax, tickValues } from './chartUtils';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * ColumnChart — Lepidus Design System
 *
 * Vertical counterpart of BarChart in the same Figma chart style (node
 * 760:1291): thin columns with rounded tops in the shared palette, dashed
 * horizontal gridlines, 10px axis text. Grouped by default; `stacked` joins
 * each group into one segmented column sized by the category total.
 */
export const ColumnChart = forwardRef<HTMLDivElement, ColumnChartProps>(
  (
    {
      categories,
      series,
      colorByCategory = false,
      max,
      ticks = 4,
      stacked = false,
      height = 220,
      columnWidth = 10,
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
          ariaLabel ??
          `Column chart of ${series.map((s) => s.name).join(', ')} by ${categories.length} categories`
        }
        className={cx(styles.columnChart, className)}
        {...props}
      >
        <div className={styles.columnBody}>
          <div className={styles.columnYAxis} style={{ height }} aria-hidden="true">
            {axisTicks.map((t, i) => (
              <span key={i} className={styles.columnYTick} style={{ bottom: `${(i / ticks) * 100}%` }}>
                {formatValue(t)}
              </span>
            ))}
          </div>

          <div className={styles.columnPlot} style={{ height }}>
            <div className={styles.columnGridlines} aria-hidden="true">
              {axisTicks.map((_, i) => (
                <span
                  key={i}
                  className={styles.columnGridline}
                  style={{ bottom: `${(i / ticks) * 100}%` }}
                />
              ))}
            </div>

            {categories.map((category, ci) => (
              <div key={`${category}-${ci}`} className={styles.columnGroup}>
                {stacked ? (
                  <div className={styles.stackedColumn} style={{ width: columnWidth }}>
                    {series.map((s, si) => {
                      const value = s.values[ci] ?? 0;
                      return (
                        <div
                          key={s.name}
                          className={styles.stackedColumnSegment}
                          title={`${category} — ${s.name}: ${formatValue(value)}`}
                          style={{
                            height: `${Math.min(100, (value / axisMax) * 100)}%`,
                            backgroundColor: chartColor(si, s.color),
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  series.map((s, si) => {
                    const value = s.values[ci] ?? 0;
                    return (
                      <div
                        key={s.name}
                        className={styles.column}
                        title={`${category} — ${s.name}: ${formatValue(value)}`}
                        style={{
                          width: columnWidth,
                          height: `${Math.min(100, (value / axisMax) * 100)}%`,
                          backgroundColor:
                            colorByCategory && series.length === 1
                              ? chartColor(ci, s.color)
                              : chartColor(si, s.color),
                        }}
                      />
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.columnXLabels} aria-hidden="true">
          {categories.map((category, ci) => (
            <span key={`${category}-${ci}`} className={styles.columnXLabel}>
              {category}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

ColumnChart.displayName = 'ColumnChart';
