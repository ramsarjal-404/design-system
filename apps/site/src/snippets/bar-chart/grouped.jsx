import { BarChart, ChartCard, ChartLegend, CHART_COLORS } from '@lepidus/react';

const CATEGORIES = ['FS1', 'FS2', 'FS3', 'FS4', 'FS5'];
const SERIES = [
  { name: 'Failed', values: [312, 261, 27, 162, 150] },
  { name: 'Warning', values: [583, 42, 64, 583, 246] },
  { name: 'Healthy', values: [477, 105, 137, 447, 308] },
];

<ChartCard
  title="Audit Status by File Server"
  lastUpdated="Last Updated on 12/06/2026 09:40 AM"
>
  <BarChart categories={CATEGORIES} series={SERIES} />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
