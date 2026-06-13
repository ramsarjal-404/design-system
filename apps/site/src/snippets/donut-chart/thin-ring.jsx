import { DonutChart, ChartCard } from '@ramsarjal-404/react';

// compact dashboard stat — pair with an external ChartLegend or data table
<ChartCard title="Alerts">
  <DonutChart
    data={[
      { label: 'Failed', value: 32 },
      { label: 'Warning', value: 58 },
      { label: 'Healthy', value: 210 },
    ]}
    size={140}
    thickness={12}
    hideLegend
    centerLabel="Alerts"
  />
</ChartCard>
