import { forwardRef, useEffect, useRef, useState } from 'react';
import type { LineChartProps } from './Charts.types';
import { chartColor } from './palette';
import { defaultFormat, niceAxisMax, tickValues } from './chartUtils';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const PAD = { top: 10, right: 16, bottom: 24, left: 36 };

/**
 * LineChart — Lepidus Design System
 *
 * Multi-series line chart in the Figma chart style (node 760:1291): dashed
 * vertical gridlines at every x label, 10px axis text, series in the shared
 * chart palette. Optional soft area fill and point markers.
 *
 * The SVG is drawn in real pixels (container width is measured with a
 * ResizeObserver), so text, strokes and dots stay crisp at every size
 * instead of scaling with the viewBox.
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      labels,
      series,
      max,
      ticks = 4,
      area = false,
      dots = true,
      height = 240,
      formatValue = defaultFormat,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(600);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width;
        if (w) setWidth(w);
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const axisMax = max ?? niceAxisMax(Math.max(0, ...series.flatMap((s) => s.values)), ticks);
    const yTicks = tickValues(axisMax, ticks);

    const plotW = Math.max(0, width - PAD.left - PAD.right);
    const plotH = Math.max(0, height - PAD.top - PAD.bottom);
    const x = (i: number) =>
      PAD.left + (labels.length > 1 ? (i / (labels.length - 1)) * plotW : plotW / 2);
    const y = (v: number) => PAD.top + (1 - v / axisMax) * plotH;

    return (
      <div
        ref={setRefs}
        role="img"
        aria-label={ariaLabel ?? `Line chart of ${series.map((s) => s.name).join(', ')} over ${labels.length} points`}
        className={cx(styles.lineChart, className)}
        {...props}
      >
        <svg className={styles.lineSvg} width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* dashed vertical gridlines, one per label */}
          {labels.map((_, i) => (
            <line
              key={`grid-${i}`}
              className={styles.svgGridline}
              x1={x(i)}
              y1={PAD.top}
              x2={x(i)}
              y2={PAD.top + plotH}
            />
          ))}

          {/* y-axis tick labels */}
          {yTicks.map((t, i) => (
            <text key={`y-${i}`} className={styles.svgTickText} x={PAD.left - 8} y={y(t) + 3} textAnchor="end">
              {formatValue(t)}
            </text>
          ))}

          {/* x-axis labels */}
          {labels.map((label, i) => (
            <text key={`x-${i}`} className={styles.svgTickText} x={x(i)} y={height - 8} textAnchor="middle">
              {label}
            </text>
          ))}

          {series.map((s, si) => {
            const color = chartColor(si, s.color);
            const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
            return (
              <g key={s.name}>
                {area && (
                  <polygon
                    points={`${x(0)},${PAD.top + plotH} ${pts} ${x(s.values.length - 1)},${PAD.top + plotH}`}
                    fill={color}
                    opacity={0.12}
                  />
                )}
                <polyline className={styles.svgLine} points={pts} stroke={color} />
                {dots &&
                  s.values.map((v, i) => (
                    <circle key={i} className={styles.svgDot} cx={x(i)} cy={y(v)} r={3.5} stroke={color}>
                      <title>{`${labels[i]} — ${s.name}: ${formatValue(v)}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';
