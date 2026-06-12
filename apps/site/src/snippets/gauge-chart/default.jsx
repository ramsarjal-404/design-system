import { GaugeChart, ChartCard } from '@lepidus/react';

<ChartCard title="System Health">
  <GaugeChart
    value={72}
    label="Health Score"
    aria-label="Health score: 72 of 100"
  />
</ChartCard>
