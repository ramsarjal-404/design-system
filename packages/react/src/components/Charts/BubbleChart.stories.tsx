import type { Meta, StoryObj } from '@storybook/react';
import { BubbleChart } from './BubbleChart';
import { ChartCard } from './ChartCard';
import { ChartLegend } from './ChartLegend';
import { CHART_COLORS } from './palette';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Scatter/bubble chart in the Lepidus chart style, from the Design Essentials dashboard
([node 29:9720](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=29-9720),
"Security Group Changes" card).

## Overview

\`BubbleChart\` plots points with magnitude: each point carries \`x\`/\`y\` coordinates and a pixel
radius \`r\`, drawn as a translucent palette bubble with a solid rim over a light grid. Series take
the shared \`CHART_COLORS\` palette (or per-series \`color\`), and every bubble exposes a native
tooltip. Like **LineChart**, it renders in real pixels via a ResizeObserver, so rims and grid
stay crisp at any width.

Use it when *three* dimensions matter (position + size); for plain comparisons use Bar/Column.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Grid | \`--gray-150\`, 0.6px | #E0E0E0 |
| Bubbles | \`CHART_COLORS\` — 25% fill, solid 1.5px rim | Figma Bar-Graph1 + brand primitives |
| Surface | compose inside **ChartCard** | |

## Accessibility

- Root is \`role="img"\` with a generated label; override with the real insight.
- Each bubble's tooltip reads "series — label: (x, y)"; keep **ChartLegend** adjacent since
  series differ by color alone.
`;

const SERIES = [
  { name: 'Product 1', points: [{ x: 12, y: 30, r: 24, label: 'FS1' }, { x: 28, y: 55, r: 14 }, { x: 44, y: 38, r: 10 }] },
  { name: 'Product 2', points: [{ x: 35, y: 72, r: 12 }, { x: 58, y: 48, r: 23 }, { x: 70, y: 80, r: 16 }] },
  { name: 'Product 3', points: [{ x: 82, y: 35, r: 21 }, { x: 90, y: 62, r: 13 }, { x: 64, y: 22, r: 10 }] },
];

const meta: Meta<typeof BubbleChart> = {
  title: 'Charts/Bubble Chart',
  component: BubbleChart,
  tags: ['autodocs'],
  argTypes: {
    series: { description: 'Bubble series — points carry x/y plus a pixel radius.', table: { type: { summary: 'BubbleSeries[]' } } },
    xMax: { control: 'number', description: 'X-axis maximum (default: nice ceiling).' },
    yMax: { control: 'number', description: 'Y-axis maximum (default: nice ceiling).' },
    height: { control: 'number', description: 'Plot height in px (default 240).' },
    showGrid: { control: 'boolean', description: 'Light background grid (default true).' },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=29-9720',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleChart>;

export const InChartCard: Story = {
  name: 'In ChartCard (Figma card)',
  render: () => (
    <ChartCard title="Security Group Changes" lastUpdated="Last Updated on 21/08/2022 1:08 PM">
      <BubbleChart series={SERIES} />
      <ChartLegend items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
    </ChartCard>
  ),
};

export const Bare: Story = {
  args: { series: SERIES.slice(0, 2), height: 200 },
  decorators: [(StoryFn) => <ChartCard title="Changes by Product"><StoryFn /></ChartCard>],
};
