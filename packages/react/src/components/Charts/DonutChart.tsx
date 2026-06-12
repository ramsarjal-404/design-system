import { forwardRef } from 'react';
import type { DonutChartProps } from './Charts.types';
import { chartColor } from './palette';
import { defaultFormat } from './chartUtils';
import { ChartLegend } from './ChartLegend';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * DonutChart — Lepidus Design System
 *
 * Proportional ring in the Figma chart style (node 760:1291 palette), with a
 * center stat (sum of values by default) and a value legend on the right.
 */
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      centerValue,
      centerLabel,
      size = 180,
      thickness = 22,
      hideLegend = false,
      formatValue = defaultFormat,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    let cumulative = 0;
    const segments = data.map((d, i) => {
      const fraction = total > 0 ? Math.max(0, d.value) / total : 0;
      const segment = {
        ...d,
        color: chartColor(i, d.color),
        dasharray: `${fraction * circumference} ${circumference}`,
        dashoffset: -cumulative * circumference,
      };
      cumulative += fraction;
      return segment;
    });

    return (
      <div
        ref={ref}
        role="img"
        aria-label={
          ariaLabel ??
          `Donut chart: ${data.map((d) => `${d.label} ${formatValue(d.value)}`).join(', ')}`
        }
        className={cx(styles.donutChart, className)}
        {...props}
      >
        <div className={styles.donutRing} style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} className={styles.donutSvg}>
            <circle
              className={styles.donutTrack}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={thickness}
            />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              >
                <title>{`${seg.label}: ${formatValue(seg.value)}`}</title>
              </circle>
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutValue}>{centerValue ?? formatValue(total)}</span>
            {centerLabel && <span className={styles.donutLabel}>{centerLabel}</span>}
          </div>
        </div>

        {!hideLegend && (
          <ChartLegend
            className={styles.donutLegend}
            items={segments.map((seg) => ({
              label: seg.label,
              color: seg.color,
              value: formatValue(seg.value),
            }))}
          />
        )}
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';
