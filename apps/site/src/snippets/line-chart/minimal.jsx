import { LineChart, ChartCard } from '@lepidus/react';

// compact configuration: no dots (also removes tooltips), 3 ticks, shorter plot
<ChartCard title="Failed Logins">
  <LineChart
    labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
    series={[{ name: 'Failed logins', values: [12, 18, 9, 24, 32, 22] }]}
    dots={false}
    ticks={3}
    height={180}
  />
</ChartCard>
