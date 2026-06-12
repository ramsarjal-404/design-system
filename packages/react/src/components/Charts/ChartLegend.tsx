import { forwardRef } from 'react';
import type { ChartLegendProps } from './Charts.types';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Swatch legend shared by all chart types. */
export const ChartLegend = forwardRef<HTMLUListElement, ChartLegendProps>(
  ({ items, className, ...props }, ref) => (
    <ul ref={ref} className={cx(styles.legend, className)} {...props}>
      {items.map((item, i) => (
        <li key={i} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
          <span className={styles.legendLabel}>{item.label}</span>
          {item.value !== undefined && <span className={styles.legendValue}>{item.value}</span>}
        </li>
      ))}
    </ul>
  )
);

ChartLegend.displayName = 'ChartLegend';
