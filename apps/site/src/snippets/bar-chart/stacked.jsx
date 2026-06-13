import { BarChart, ChartCard, ChartLegend, CHART_COLORS } from '@ramsarjal-404/react';

const CATEGORIES = ['AD-Primary', 'Exchange-01', 'SQL-Cluster', 'SharePoint'];
const SERIES = [
  { name: 'Critical', values: [42, 18, 65, 12] },
  { name: 'Warning', values: [120, 74, 96, 38] },
  { name: 'Info', values: [310, 220, 180, 95] },
];

// stacked: one segmented bar per category, sized by the total
<ChartCard title="Alert Composition by System">
  <BarChart categories={CATEGORIES} series={SERIES} stacked labelWidth={90} />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
