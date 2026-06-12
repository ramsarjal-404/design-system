import { DonutChart, ChartCard } from '@lepidus/react';

const DATA = [
  { label: 'Compliant', value: 1184 },
  { label: 'At risk', value: 37 },
  { label: 'Non-compliant', value: 12 },
];

<ChartCard title="Data Classification Coverage">
  <DonutChart
    data={DATA}
    centerValue="96%"
    centerLabel="Compliant"
    formatValue={(v) => v.toLocaleString()}
  />
</ChartCard>
