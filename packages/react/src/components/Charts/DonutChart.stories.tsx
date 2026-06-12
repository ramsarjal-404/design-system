import type { Meta, StoryObj } from '@storybook/react';
import { DonutChart } from './DonutChart';
import { ChartCard } from './ChartCard';
import { FilterIcon } from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Proportional donut chart in the Lepidus chart style (Figma node 760:1291 palette).

## Overview

\`DonutChart\` shows part-to-whole composition as a ring on a \`--gray-100\` track, with a center
stat (the sum of values by default, override with \`centerValue\`/\`centerLabel\`) and a built-in
value legend on the right (\`hideLegend\` to opt out). Segments use the shared \`CHART_COLORS\`
palette — Figma's Bar-Graph1 red/yellow/green first — or per-datum \`color\` overrides, and each
segment carries a native tooltip.

Keep it to ~5 segments; beyond that, a horizontal **BarChart** compares parts more honestly.

## Accessibility

- Chart root is \`role="img"\` with a generated label listing every segment and value.
- The legend shows exact values, so the ring is never the only way to read the data.
`;

const DATA = [
  { label: 'Failed', value: 32 },
  { label: 'Warning', value: 58 },
  { label: 'Healthy', value: 210 },
];

const meta: Meta<typeof DonutChart> = {
  title: 'Charts/Donut Chart',
  component: DonutChart,
  tags: ['autodocs'],
  argTypes: {
    data: { description: 'Segments: label, value, optional color override.', table: { type: { summary: 'DonutDatum[]' } } },
    centerValue: { control: 'text', description: 'Big number in the hole (default: sum of values).' },
    centerLabel: { control: 'text', description: 'Caption under the center value.' },
    size: { control: 'number', description: 'Outer diameter in px (default 180).' },
    thickness: { control: 'number', description: 'Ring thickness in px (default 22).' },
    hideLegend: { control: 'boolean', description: 'Hide the built-in value legend.' },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=760-1291',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const InChartCard: Story = {
  name: 'In ChartCard',
  render: () => (
    <div style={{ width: 480 }}>
      <ChartCard
        title="Alert Status Breakdown"
        lastUpdated="Last Updated on 21/08/2022 1:08 PM"
        actions={<FilterIcon size={20} />}
      >
        <DonutChart data={DATA} centerLabel="Total Alerts" />
      </ChartCard>
    </div>
  ),
};

export const WithLegend: Story = {
  name: 'With legend',
  args: { data: DATA, centerLabel: 'Total Alerts' },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 480 }}>
        <ChartCard title="Alert Status Breakdown">
          <StoryFn />
        </ChartCard>
      </div>
    ),
  ],
};

export const ThinRing: Story = {
  name: 'Thin ring, no legend',
  args: { data: DATA, thickness: 12, size: 140, hideLegend: true, centerLabel: 'Alerts' },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <ChartCard title="Alerts">
          <StoryFn />
        </ChartCard>
      </div>
    ),
  ],
  parameters: {
    docs: { description: { story: 'Compact configuration for dashboards — pair with an external ChartLegend.' } },
  },
};
