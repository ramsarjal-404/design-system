import type { Meta, StoryObj } from '@storybook/react';
import { ColumnChart } from './ColumnChart';
import { ChartCard } from './ChartCard';
import { ChartLegend } from './ChartLegend';
import { CHART_COLORS } from './palette';
import { RefreshIcon, FilterIcon } from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Vertical bar chart in the Lepidus chart style (Figma node 760:1291 family).

## Overview

\`ColumnChart\` is the vertical counterpart of **BarChart**, sharing the full visual grammar:
thin columns (\`columnWidth\`, 10px default) with rounded tops in the \`CHART_COLORS\` palette,
dashed \`--gray-150\` gridlines, and 10px \`--component-card-title-text\` axis text. Grouped by
default; \`stacked\` joins each group into one segmented column sized by the category total —
use stacked when the total matters, grouped when comparing series.

Prefer ColumnChart for time-bucketed comparisons (per month, per day); prefer **BarChart**
when category names are long or there are many categories.

## Accessibility

- Chart root is \`role="img"\` with a generated \`aria-label\` — override with the real insight.
- Every column/segment exposes "category — series: value" as a native tooltip.
- Keep the legend adjacent; color alone separates series.
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SERIES = [
  { name: 'Failed', values: [12, 18, 9, 24, 32, 22] },
  { name: 'Warning', values: [22, 14, 26, 18, 24, 35] },
  { name: 'Healthy', values: [45, 52, 40, 58, 49, 66] },
];

const meta: Meta<typeof ColumnChart> = {
  title: 'Charts/Column Chart',
  component: ColumnChart,
  tags: ['autodocs'],
  argTypes: {
    categories: { description: 'Labels under the columns.', table: { type: { summary: 'string[]' } } },
    series: { description: 'One column per series per category.', table: { type: { summary: 'ChartSeries[]' } } },
    max: { control: 'number', description: 'Y-axis maximum (default: nice ceiling of the data max).' },
    ticks: { control: 'number', description: 'Y-axis divisions (default 4).' },
    stacked: { control: 'boolean', description: 'One segmented column per category.' },
    height: { control: 'number', description: 'Plot height in px (default 220).' },
    columnWidth: { control: 'number', description: 'Column width in px (default 10).' },
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
type Story = StoryObj<typeof ColumnChart>;

export const Grouped: Story = {
  args: { categories: MONTHS, series: SERIES },
  decorators: [
    (StoryFn) => (
      <ChartCard
        title="Alerts Per Month"
        lastUpdated="Last Updated on 21/08/2022 1:08 PM"
        actions={
          <>
            <FilterIcon size={20} />
            <RefreshIcon size={20} />
          </>
        }
      >
        <StoryFn />
        <ChartLegend items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
      </ChartCard>
    ),
  ],
};

export const Stacked: Story = {
  args: { categories: MONTHS, series: SERIES, stacked: true, columnWidth: 18 },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Alert Volume Per Month">
        <StoryFn />
        <ChartLegend items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
      </ChartCard>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Stacked columns size by the category total — wider 18px columns read better when segmented.',
      },
    },
  },
};

export const SingleSeries: Story = {
  name: 'Single series',
  args: {
    categories: MONTHS,
    series: [{ name: 'Backups', values: [42, 28, 65, 12, 38, 51], color: CHART_COLORS[3] }],
    columnWidth: 14,
    ticks: 4,
  },
  decorators: [
    (StoryFn) => (
      <ChartCard title="Backups Per Month">
        <StoryFn />
      </ChartCard>
    ),
  ],
};
