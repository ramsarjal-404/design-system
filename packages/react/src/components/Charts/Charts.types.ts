import { type HTMLAttributes, type ReactNode } from 'react';

/** One data series — `values` align by index with the chart's categories/labels. */
export interface ChartSeries {
  name: string;
  values: number[];
  /** Override the palette color for this series */
  color?: string;
}

export interface ChartCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card heading, brand blue (e.g. "Most Inactive Department On Copilot") */
  title: ReactNode;
  /** Timestamp line next to the title (e.g. "Last Updated on 21/08/2022 1:08 PM") */
  lastUpdated?: ReactNode;
  /** Icon buttons / controls on the right of the header */
  actions?: ReactNode;
  /** Remove the default 1160px max-width from the Figma frame */
  fullWidth?: boolean;
  children: ReactNode;
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Row labels down the left (e.g. server names) */
  categories: string[];
  /** One group of bars per category; series i = bar i in every group */
  series: ChartSeries[];
  /** Axis maximum — defaults to a "nice" ceiling of the data max */
  max?: number;
  /** Number of axis divisions (default 6) */
  ticks?: number;
  /** Width reserved for category labels, px (default 40) */
  labelWidth?: number;
  /** One segmented bar per category instead of a group of bars */
  stacked?: boolean;
  /** Format axis ticks and tooltip values */
  formatValue?: (value: number) => string;
}

export interface ColumnChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Labels under the columns */
  categories: string[];
  /** With a single series, color each category's column from the palette */
  colorByCategory?: boolean;
  /** One group of columns per category; series i = column i in every group */
  series: ChartSeries[];
  /** Axis maximum — defaults to a "nice" ceiling of the data max */
  max?: number;
  /** Number of y-axis divisions (default 4) */
  ticks?: number;
  /** One segmented column per category instead of a group */
  stacked?: boolean;
  /** Plot height in px (default 220) */
  height?: number;
  /** Column width in px (default 10) */
  columnWidth?: number;
  formatValue?: (value: number) => string;
}

export interface BubblePoint {
  x: number;
  y: number;
  /** Bubble radius in px */
  r: number;
  label?: string;
}

export interface BubbleSeries {
  name: string;
  color?: string;
  points: BubblePoint[];
}

export interface BubbleChartProps extends HTMLAttributes<HTMLDivElement> {
  series: BubbleSeries[];
  /** Axis maxima — default to a "nice" ceiling of the data */
  xMax?: number;
  yMax?: number;
  /** Plot height in px (default 240); width tracks the container */
  height?: number;
  /** Light background grid (default true) */
  showGrid?: boolean;
}

export interface GaugeChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Current reading */
  value: number;
  /** Gauge maximum (default 100) */
  max?: number;
  /** Caption under the center value (e.g. "Health Score") */
  label?: ReactNode;
  /** Arc color (default brand blue). Ignored when `thresholds` is set. */
  color?: string;
  /** Color by reading: first entry whose `upTo` ≥ value wins (e.g. green/yellow/red bands) */
  thresholds?: Array<{ upTo: number; color: string }>;
  /** Overall width in px (default 200) */
  size?: number;
  /** Arc thickness in px (default 18) */
  thickness?: number;
  formatValue?: (value: number) => string;
}

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  /** X-axis labels — every series should have one value per label */
  labels: string[];
  series: ChartSeries[];
  /** Axis maximum — defaults to a "nice" ceiling of the data max */
  max?: number;
  /** Number of y-axis divisions (default 4) */
  ticks?: number;
  /** Soft fill under each line */
  area?: boolean;
  /** Markers on data points (default true) */
  dots?: boolean;
  /** Plot height in px (default 240); width tracks the container */
  height?: number;
  formatValue?: (value: number) => string;
}

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  data: DonutDatum[];
  /** Big number in the hole — defaults to the sum of values */
  centerValue?: ReactNode;
  /** Caption under the center value (e.g. "Total Alerts") */
  centerLabel?: ReactNode;
  /** Outer diameter, px (default 180) */
  size?: number;
  /** Ring thickness, px (default 22) */
  thickness?: number;
  /** Hide the built-in legend (values + labels on the right) */
  hideLegend?: boolean;
  formatValue?: (value: number) => string;
}

export interface ChartLegendItem {
  label: ReactNode;
  color: string;
  value?: ReactNode;
}

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {
  items: ChartLegendItem[];
}
