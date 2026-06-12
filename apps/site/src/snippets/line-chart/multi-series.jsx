import { LineChart, ChartCard, ChartLegend, CHART_COLORS } from '@lepidus/react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const SERIES = [
  { name: 'Failed', values: [12, 18, 9, 24, 32, 22, 38, 30] },
  { name: 'Warning', values: [22, 14, 26, 18, 24, 35, 28, 41] },
  { name: 'Healthy', values: [45, 52, 40, 58, 49, 66, 60, 72] },
];

<ChartCard
  title="Permission Changes Over Time"
  lastUpdated="Last Updated on 12/06/2026 09:40 AM"
>
  <LineChart
    labels={MONTHS}
    series={SERIES}
    aria-label="Permission changes per month: failed changes trending up since March"
  />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
