import { BarChart, ChartCard, CHART_COLORS } from '@lepidus/react';

<ChartCard title="Permission Changes by Server">
  <BarChart
    categories={['AD-Primary', 'Exchange-01', 'SQL-Cluster', 'FileServer-East']}
    series={[
      // per-series color must reference a --color-chart-series-* token
      { name: 'Permission changes', values: [42, 28, 65, 12], color: CHART_COLORS[3] },
    ]}
    ticks={4}
    labelWidth={90}
    formatValue={(v) => v.toLocaleString()}
  />
</ChartCard>
