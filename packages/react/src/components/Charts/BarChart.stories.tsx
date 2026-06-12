import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';
import { ChartCard } from './ChartCard';
import { ChartLegend } from './ChartLegend';
import { CHART_COLORS } from './palette';
import { ReportIcon, FilterIcon, RefreshIcon } from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Horizontal grouped bar chart matching the Figma "Bar Chart 3 Colors Flexible" frame (node 760:1291).

## Overview

\`BarChart\` compares one or more series across categories with the Figma anatomy: category labels
down the left, groups of 6px bars with rounded right ends, dashed vertical gridlines, and a 10px
numeric axis. Bars scale to a "nice" ceiling of the data max (override with \`max\`), and every bar
carries a native tooltip ("FS1 — Failed: 312").

Wrap charts in **ChartCard** for the Figma surface — brand-blue title, "Last Updated" stamp and an
actions slot — and add **ChartLegend** when series need naming.

## Design tokens & palette

Structural colors bind to tokens: axis/label text \`--component-card-title-text\`, gridlines
\`--gray-150\`, card surface \`--color-background-surface\` with \`--radius-input\` (25px). Series
colors come from \`CHART_COLORS\` — the Figma styles \`Bar-Graph1-Color1/2/3\` (#F94144 red,
#F9C74F yellow, #1AA367 green) extended with brand primitives — or per-series \`color\` overrides.
The Figma frame's chart text is drawn in Inter; it is reconciled to the system
\`--font-family-primary\` here.

## Accessibility

- The chart root is \`role="img"\` with a generated \`aria-label\` (override it with a real summary
  of the insight, not just the series names).
- Values are reachable as native tooltips per bar; pair the chart with a table for full data access.
- The palette alone doesn't separate series for color-blind users — keep the legend visible.
`;

const CATEGORIES = ['FS1', 'FS2', 'FS3', 'FS4', 'FS5', 'FS6', 'FS7', 'FS8'];
const SERIES = [
  { name: 'Failed', values: [312, 261, 27, 162, 150, 150, 11, 187] },
  { name: 'Warning', values: [583, 42, 64, 583, 246, 186, 100, 60] },
  { name: 'Healthy', values: [477, 105, 137, 447, 308, 259, 154, 103] },
];

const meta: Meta<typeof BarChart> = {
  title: 'Charts/Bar Chart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    categories: { description: 'Row labels down the left.', table: { type: { summary: 'string[]' } } },
    series: {
      description: 'One group of bars per category; `values` align by index with `categories`.',
      table: { type: { summary: 'ChartSeries[]' } },
    },
    max: { control: 'number', description: 'Axis maximum (default: nice ceiling of the data max).' },
    ticks: { control: 'number', description: 'Axis divisions (default 6).' },
    labelWidth: { control: 'number', description: 'Width reserved for category labels in px (default 40).' },
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
type Story = StoryObj<typeof BarChart>;

export const InChartCard: Story = {
  name: 'In ChartCard (Figma frame)',
  render: () => (
    <ChartCard
      title="Most Inactive Department On Copilot"
      lastUpdated="Last Updated on 21/08/2022 1:08 PM"
      actions={
        <>
          <ReportIcon size={20} />
          <FilterIcon size={20} />
          <RefreshIcon size={20} />
        </>
      }
    >
      <BarChart categories={CATEGORIES} series={SERIES} />
      <ChartLegend
        items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
      />
    </ChartCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The full Figma composition: ChartCard header (brand title, timestamp, icon actions), grouped bars over dashed gridlines, and the shared legend.',
      },
    },
  },
};

export const Compact: Story = {
  name: 'Compact (5 categories)',
  args: { categories: CATEGORIES.slice(0, 5), series: SERIES.map((s) => ({ ...s, values: s.values.slice(0, 5) })) },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Server Alerts">
        <StoryFn />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: { description: { story: 'Fewer rows on the standard white ChartCard surface.' } },
  },
};

export const Stacked: Story = {
  args: { categories: CATEGORIES, series: SERIES, stacked: true },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Alert Composition by Server">
        <StoryFn />
        <ChartLegend items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'One segmented 8px bar per category, sized by the total — use when the sum matters more than series comparison.',
      },
    },
  },
};

export const SingleSeries: Story = {
  name: 'Single series',
  args: {
    categories: ['AD-Primary', 'Exchange-01', 'SQL-Cluster', 'FileServer-East'],
    series: [{ name: 'Alerts', values: [42, 28, 65, 12], color: CHART_COLORS[3] }],
    ticks: 4,
    labelWidth: 90,
  },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Alerts by Server">
        <StoryFn />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'One series with a per-series `color` override (brand blue) and wider category labels.',
      },
    },
  },
};
