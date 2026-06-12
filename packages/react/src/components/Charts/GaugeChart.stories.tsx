import type { Meta, StoryObj } from '@storybook/react';
import { GaugeChart } from './GaugeChart';
import { ChartCard } from './ChartCard';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Semi-circular KPI gauge in the Lepidus chart style (Figma node 760:1291 palette).

## Overview

\`GaugeChart\` reports a single reading against a maximum — health score, risk level, capacity —
as a rounded arc on a \`--gray-100\` track with the value centered inside and 0/max bounds under
the ends. The arc is brand blue by default, takes a fixed \`color\`, or bands by reading with
\`thresholds\` (first entry whose \`upTo\` ≥ value wins), e.g. the chart palette's green → yellow
→ red as risk climbs.

Use a gauge for one number that needs instant judgment against a scale; if you're tempted to
show several gauges side by side, a **BarChart** compares them better.

## Accessibility

- Root is \`role="img"\` labeled "Gauge: value of max" — override \`aria-label\` with the metric
  name ("Risk score: 72 of 100").
- The reading is rendered as text in the center, never color alone; the arc carries a tooltip.
`;

const meta: Meta<typeof GaugeChart> = {
  title: 'Charts/Gauge Chart',
  component: GaugeChart,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number', description: 'Current reading.' },
    max: { control: 'number', description: 'Gauge maximum (default 100).' },
    label: { control: 'text', description: 'Caption under the center value.' },
    color: { control: 'color', description: 'Fixed arc color (default brand blue). Ignored with `thresholds`.' },
    thresholds: {
      description: 'Color bands: first entry whose `upTo` ≥ value wins.',
      table: { type: { summary: 'Array<{ upTo: number; color: string }>' } },
    },
    size: { control: 'number', description: 'Overall width in px (default 200).' },
    thickness: { control: 'number', description: 'Arc thickness in px (default 18).' },
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
type Story = StoryObj<typeof GaugeChart>;

export const Default: Story = {
  args: { value: 72, label: 'Health Score' },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <ChartCard title="System Health">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StoryFn />
          </div>
        </ChartCard>
      </div>
    ),
  ],
};

export const Thresholds: Story = {
  name: 'Threshold bands',
  render: () => (
    <div style={{ width: 760 }}>
      <ChartCard title="Risk Levels">
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[42, 74, 93].map((v) => (
            <GaugeChart
              key={v}
              value={v}
              label="Risk Score"
              size={170}
              thresholds={[
                { upTo: 60, color: '#1aa367' },
                { upTo: 85, color: '#f9c74f' },
                { upTo: 100, color: '#f94144' },
              ]}
              aria-label={`Risk score: ${v} of 100`}
            />
          ))}
        </div>
      </ChartCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same gauge banded with the chart palette: green to 60, yellow to 85, red beyond — color follows the reading.',
      },
    },
  },
};
