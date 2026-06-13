import { BubbleChart, ChartCard, ChartLegend, CHART_COLORS } from '@ramsarjal-404/react';

// each point: x/y position plus a literal pixel radius r; label feeds the tooltip
const SERIES = [
  {
    name: 'File servers',
    points: [
      { x: 12, y: 30, r: 24, label: 'FS1' },
      { x: 28, y: 55, r: 14, label: 'FS2' },
      { x: 44, y: 38, r: 10, label: 'FS3' },
    ],
  },
  {
    name: 'Domain controllers',
    points: [
      { x: 35, y: 72, r: 12, label: 'DC1' },
      { x: 58, y: 48, r: 23, label: 'DC2' },
    ],
  },
  {
    name: 'SQL servers',
    points: [
      { x: 82, y: 35, r: 21, label: 'SQL1' },
      { x: 64, y: 22, r: 10, label: 'SQL2' },
    ],
  },
];

<ChartCard
  title="Security Group Changes"
  lastUpdated="Last Updated on 12/06/2026 09:40 AM"
>
  <BubbleChart
    series={SERIES}
    aria-label="Security group changes by server type, bubble size shows change volume; largest cluster on DC2"
  />
  <ChartLegend
    items={SERIES.map((s, i) => ({ label: s.name, color: CHART_COLORS[i] }))}
  />
</ChartCard>
