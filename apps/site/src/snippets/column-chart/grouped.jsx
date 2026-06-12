import { ColumnChart, ChartCard, ChartLegend, CHART_COLORS } from '@lepidus/react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SERIES = [
  { name: 'Failed', values: [12, 18, 9, 24, 32, 22] },
  { name: 'Warning', values: [22, 14, 26, 18, 24, 35] },
  { name: 'Healthy', values: [45, 52, 40, 58, 49, 66] },
];

<ChartCard
  title="Alerts Per Month"
  lastUpdated="Last Updated on 12/06/2026 09:40 AM"
>
  <ColumnChart categories={MONTHS} series={SERIES} />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
