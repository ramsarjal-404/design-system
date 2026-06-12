import { forwardRef } from 'react';
import type { GaugeChartProps } from './Charts.types';
import { CHART_COLORS } from './palette';
import { defaultFormat } from './chartUtils';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * GaugeChart — Lepidus Design System
 *
 * Semi-circular KPI dial in the Figma chart style (node 760:1291 palette):
 * a rounded arc on a gray track with the reading centered inside and 0/max
 * labels at the ends. Color is fixed (`color`, brand blue by default) or
 * banded by reading via `thresholds` — e.g. green up to 60, yellow up to 85,
 * red beyond.
 */
export const GaugeChart = forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      max = 100,
      label,
      color,
      thresholds,
      size = 200,
      thickness = 18,
      formatValue = defaultFormat,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const fraction = max > 0 ? clamped / max : 0;

    const arcColor =
      thresholds?.find((t) => clamped <= t.upTo)?.color ??
      thresholds?.[thresholds.length - 1]?.color ??
      color ??
      CHART_COLORS[3];

    const radius = (size - thickness) / 2;
    const cx0 = size / 2;
    const cy0 = size / 2;
    const arcLength = Math.PI * radius;
    const svgHeight = size / 2 + thickness / 2;
    const arcPath = `M ${cx0 - radius} ${cy0} A ${radius} ${radius} 0 0 1 ${cx0 + radius} ${cy0}`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel ?? `Gauge: ${formatValue(clamped)} of ${formatValue(max)}`}
        className={cx(styles.gaugeChart, className)}
        style={{ width: size }}
        {...props}
      >
        <div className={styles.gaugeArc} style={{ height: svgHeight }}>
          <svg viewBox={`0 0 ${size} ${svgHeight}`} width={size} height={svgHeight}>
            <path className={styles.gaugeTrack} d={arcPath} strokeWidth={thickness} />
            {fraction > 0 && (
              <path
                d={arcPath}
                fill="none"
                stroke={arcColor}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${fraction * arcLength} ${arcLength}`}
              >
                <title>{`${formatValue(clamped)} / ${formatValue(max)}`}</title>
              </path>
            )}
          </svg>
          <div className={styles.gaugeCenter}>
            <span className={styles.gaugeValue}>{formatValue(clamped)}</span>
            {label && <span className={styles.gaugeLabel}>{label}</span>}
          </div>
        </div>
        <div className={styles.gaugeBounds} aria-hidden="true">
          <span>0</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    );
  }
);

GaugeChart.displayName = 'GaugeChart';
