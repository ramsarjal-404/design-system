import { forwardRef, useEffect, useRef, useState } from 'react';
import type { BubbleChartProps } from './Charts.types';
import { chartColor } from './palette';
import { niceAxisMax } from './chartUtils';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const PAD = 16;

/**
 * BubbleChart — Lepidus Design System
 *
 * Scatter/bubble chart in the Figma chart style (Design Essentials dashboard,
 * node 29:9720 "Security Group Changes"): translucent palette bubbles with
 * solid rims floating over a light grid. Each point carries x/y coordinates
 * and a pixel radius; series share the chart palette. Drawn in real pixels
 * (ResizeObserver) like LineChart, so rims and the grid stay crisp.
 */
export const BubbleChart = forwardRef<HTMLDivElement, BubbleChartProps>(
  (
    { series, xMax, yMax, height = 240, showGrid = true, className, 'aria-label': ariaLabel, ...props },
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

    const allPoints = series.flatMap((s) => s.points);
    const maxX = xMax ?? niceAxisMax(Math.max(1, ...allPoints.map((p) => p.x)), 4);
    const maxY = yMax ?? niceAxisMax(Math.max(1, ...allPoints.map((p) => p.y)), 4);
    const plotW = Math.max(0, width - PAD * 2);
    const plotH = Math.max(0, height - PAD * 2);
    const x = (v: number) => PAD + (v / maxX) * plotW;
    const y = (v: number) => PAD + (1 - v / maxY) * plotH;

    const gridStep = plotW / 12;
    const gridXs = Array.from({ length: 13 }, (_, i) => PAD + i * gridStep);
    const gridYs = Array.from({ length: 7 }, (_, i) => PAD + (i * plotH) / 6);

    return (
      <div
        ref={setRefs}
        role="img"
        aria-label={ariaLabel ?? `Bubble chart of ${series.map((s) => s.name).join(', ')}`}
        className={cx(styles.bubbleChart, className)}
        {...props}
      >
        <svg className={styles.lineSvg} width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {showGrid && (
            <g aria-hidden="true">
              {gridXs.map((gx, i) => (
                <line key={`v-${i}`} className={styles.bubbleGridline} x1={gx} y1={PAD} x2={gx} y2={PAD + plotH} />
              ))}
              {gridYs.map((gy, i) => (
                <line key={`h-${i}`} className={styles.bubbleGridline} x1={PAD} y1={gy} x2={PAD + plotW} y2={gy} />
              ))}
            </g>
          )}
          {series.map((s, si) => {
            const color = chartColor(si, s.color);
            return (
              <g key={s.name}>
                {s.points.map((p, pi) => (
                  <circle
                    key={pi}
                    className={styles.bubble}
                    cx={x(p.x)}
                    cy={y(p.y)}
                    r={p.r}
                    fill={color}
                    stroke={color}
                  >
                    <title>{`${s.name}${p.label ? ` — ${p.label}` : ''}: (${p.x}, ${p.y})`}</title>
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

BubbleChart.displayName = 'BubbleChart';
