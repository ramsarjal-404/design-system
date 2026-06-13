import { LineChart, ChartCard, CHART_COLORS } from '@ramsarjal-404/react';

// area adds a soft 12%-opacity fill under the line — best with one series
<ChartCard title="Healthy Objects Trend">
  <LineChart
    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']}
    series={[
      { name: 'Healthy', values: [45, 52, 40, 58, 49, 66, 60, 72], color: CHART_COLORS[2] },
    ]}
    area
  />
</ChartCard>
