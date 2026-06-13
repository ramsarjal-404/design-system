import { ColumnChart, ChartCard, ChartLegend, CHART_COLORS } from '@ramsarjal-404/react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SERIES = [
  { name: 'Critical', values: [12, 18, 9, 24, 32, 22] },
  { name: 'Warning', values: [22, 14, 26, 18, 24, 35] },
  { name: 'Info', values: [45, 52, 40, 58, 49, 66] },
];

// stacked columns size by the bucket total — widen them so segments stay legible
<ChartCard title="Alert Volume Per Month">
  <ColumnChart categories={MONTHS} series={SERIES} stacked columnWidth={18} />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
