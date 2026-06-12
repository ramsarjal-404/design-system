import type { Meta, StoryObj } from '@storybook/react';
import { ChartCard } from './ChartCard';
import { BarChart } from './BarChart';
import { ColumnChart } from './ColumnChart';
import { LineChart } from './LineChart';
import { DonutChart } from './DonutChart';
import { GaugeChart } from './GaugeChart';
import { ChartLegend } from './ChartLegend';
import { CHART_COLORS } from './palette';
import { ReportIcon, FilterIcon, RefreshIcon, ExportIcon } from '../../icons';

const overviewDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The chart kit composed as a dashboard, all in the visual grammar of the Figma chart frame
([node 760:1291](https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=760-1291)).

## Picking a chart

| Question | Chart |
| --- | --- |
| Compare categories with long names / many rows? | **BarChart** (horizontal; \`stacked\` when the total matters) |
| Compare time buckets (per month/day)? | **ColumnChart** (grouped or \`stacked\`) |
| Show a trend over ordered points? | **LineChart** (\`area\` for volume feel) |
| Part-to-whole composition (≤5 parts)? | **DonutChart** |
| One number judged against a scale? | **GaugeChart** (\`thresholds\` for risk bands) |

Every chart sits on a **ChartCard** (brand-blue 18px title, "Last Updated" stamp, icon actions,
1160px Figma max-width — \`fullWidth\` to opt out) and names its series with **ChartLegend**.

## Shared token bindings

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Card surface / radius | \`--color-background-surface\` / \`--radius-input\` | white / 25px |
| Card title | \`--font-size-18\` + medium, \`--color-text-brand\` | 18px #1C4599 |
| Axis & label text | \`--component-card-title-text\` | #364765 (10px — Figma literal, no token ≤11) |
| Gridlines | \`--gray-150\`, dashed | #E0E0E0 |
| Series palette | \`CHART_COLORS\` — Figma styles Bar-Graph1-Color1/2/3 first | #F94144 / #F9C74F / #1AA367, then brand primitives |
| Donut/gauge track | \`--gray-100\` | #F6F6F6 |

Series colors are data-driven, so they live in \`palette.ts\` rather than CSS variables; structural
colors all bind to tokens. Each chart is \`role="img"\` with a generated label, and every
bar/point/segment/arc carries a native tooltip — keep legends visible, since color alone
separates series.
`;

const CATEGORIES = ['FS1', 'FS2', 'FS3', 'FS4', 'FS5', 'FS6', 'FS7', 'FS8'];
const BAR_SERIES = [
  { name: 'Failed', values: [312, 261, 27, 162, 150, 150, 11, 187] },
  { name: 'Warning', values: [583, 42, 64, 583, 246, 186, 100, 60] },
  { name: 'Healthy', values: [477, 105, 137, 447, 308, 259, 154, 103] },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const LINE_SERIES = [
  { name: 'Failed', values: [12, 18, 9, 24, 32, 22, 38, 30] },
  { name: 'Healthy', values: [45, 52, 40, 58, 49, 66, 60, 72], color: CHART_COLORS[2] },
];
const DONUT_DATA = [
  { label: 'Failed', value: 32 },
  { label: 'Warning', value: 58 },
  { label: 'Healthy', value: 210 },
];

const meta: Meta = {
  title: 'Charts/Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=760-1291',
    },
    docs: { description: { component: overviewDescription } },
  },
};

export default meta;

export const Dashboard: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        background: 'var(--color-background-subtle, #f6f6f6)',
        borderRadius: 8,
      }}
    >
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
        <BarChart categories={CATEGORIES} series={BAR_SERIES} />
        <ChartLegend items={BAR_SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
      </ChartCard>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, alignItems: 'stretch' }}>
        <ChartCard
          title="Permission Changes Over Time"
          lastUpdated="Last Updated on 21/08/2022 1:08 PM"
          actions={<ExportIcon size={20} />}
        >
          <LineChart labels={MONTHS} series={LINE_SERIES} />
          <ChartLegend
            items={LINE_SERIES.map((s, i) => ({ label: s.name, color: s.color ?? CHART_COLORS[i] }))}
          />
        </ChartCard>

        <ChartCard title="Alert Status Breakdown" actions={<FilterIcon size={20} />}>
          <DonutChart data={DONUT_DATA} centerLabel="Total Alerts" size={160} />
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, alignItems: 'stretch' }}>
        <ChartCard title="Alert Volume Per Month" actions={<RefreshIcon size={20} />}>
          <ColumnChart
            categories={MONTHS.slice(0, 6)}
            series={BAR_SERIES.map((s) => ({ ...s, values: s.values.slice(0, 6) }))}
            stacked
            columnWidth={18}
            height={190}
          />
          <ChartLegend items={BAR_SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))} />
        </ChartCard>

        <ChartCard title="System Health">
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
            <GaugeChart
              value={72}
              label="Health Score"
              thresholds={[
                { upTo: 60, color: CHART_COLORS[0] },
                { upTo: 85, color: CHART_COLORS[1] },
                { upTo: 100, color: CHART_COLORS[2] },
              ]}
              aria-label="Health score: 72 of 100"
            />
          </div>
        </ChartCard>
      </div>
    </div>
  ),
};
