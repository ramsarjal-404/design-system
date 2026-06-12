import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';
import { ChartCard } from './ChartCard';
import { ChartLegend } from './ChartLegend';
import { CHART_COLORS } from './palette';
import { RefreshIcon, ExportIcon } from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Multi-series line chart in the Lepidus chart style (Figma node 760:1291 family).

## Overview

\`LineChart\` plots trends over ordered labels with the same visual grammar as the Figma bar chart:
dashed vertical gridlines at every x position, 10px axis text in \`--component-card-title-text\`,
and series in the shared \`CHART_COLORS\` palette. Optional \`area\` adds a soft 12%-opacity fill
under each line; \`dots\` (on by default) marks data points with white-filled markers that carry
native tooltips.

It renders as a responsive SVG (600-unit viewBox, \`height\` prop for aspect), so it scales with
its container. Wrap in **ChartCard** for the standard surface and pair with **ChartLegend**.

## Accessibility

- Chart root is \`role="img"\` with a generated \`aria-label\` — override with the actual insight.
- Each point exposes "label — series: value" as a native tooltip.
- Series differ by color only; keep the legend adjacent and consider one series per chart when
  the comparison is subtle.
`;

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const SERIES = [
  { name: 'Failed', values: [12, 18, 9, 24, 32, 22, 38, 30] },
  { name: 'Warning', values: [22, 14, 26, 18, 24, 35, 28, 41] },
  { name: 'Healthy', values: [45, 52, 40, 58, 49, 66, 60, 72] },
];

const meta: Meta<typeof LineChart> = {
  title: 'Charts/Line Chart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {
    labels: { description: 'Ordered x-axis labels.', table: { type: { summary: 'string[]' } } },
    series: { description: 'One value per label, per series.', table: { type: { summary: 'ChartSeries[]' } } },
    max: { control: 'number', description: 'Y-axis maximum (default: nice ceiling of the data max).' },
    ticks: { control: 'number', description: 'Y-axis divisions (default 4).' },
    area: { control: 'boolean', description: 'Soft fill under each line.' },
    dots: { control: 'boolean', description: 'Point markers with tooltips (default true).' },
    height: { control: 'number', description: 'Plot height in viewBox units (default 240).' },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=760-1291',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const InChartCard: Story = {
  name: 'In ChartCard',
  render: () => (
    <ChartCard
      title="Permission Changes Over Time"
      lastUpdated="Last Updated on 21/08/2022 1:08 PM"
      actions={
        <>
          <ExportIcon size={20} />
          <RefreshIcon size={20} />
        </>
      }
    >
      <LineChart labels={LABELS} series={SERIES} />
      <ChartLegend items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
    </ChartCard>
  ),
};

export const Area: Story = {
  name: 'Area fill',
  args: { labels: LABELS, series: [SERIES[2]], area: true },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Healthy Objects Trend">
        <StoryFn />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: {
      description: { story: 'Single series with the soft area fill — good for volume-style trends.' },
    },
  },
};

export const Minimal: Story = {
  args: { labels: LABELS.slice(0, 6), series: [SERIES[0]], dots: false, ticks: 3, height: 180 },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Failed Logins">
        <StoryFn />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: { description: { story: 'Compact configuration on the card surface: no dots, shorter plot.' } },
  },
};
