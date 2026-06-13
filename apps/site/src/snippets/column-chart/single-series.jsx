import { ColumnChart, ChartCard, CHART_COLORS } from '@ramsarjal-404/react';

<ChartCard title="Backups Per Month">
  <ColumnChart
    categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
    series={[
      // per-series color must reference a --color-chart-series-* token
      { name: 'Backups', values: [42, 28, 65, 12, 38, 51], color: CHART_COLORS[3] },
    ]}
    columnWidth={14}
    ticks={4}
  />
</ChartCard>
