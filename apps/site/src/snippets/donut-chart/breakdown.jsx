import { DonutChart, ChartCard } from '@lepidus/react';

const DATA = [
  { label: 'Failed', value: 32 },
  { label: 'Warning', value: 58 },
  { label: 'Healthy', value: 210 },
];

// center shows the sum (300) by default; the built-in legend prints exact values
<ChartCard title="Alert Status Breakdown" lastUpdated="Last Updated on 12/06/2026 09:40 AM">
  <DonutChart data={DATA} centerLabel="Total Alerts" />
</ChartCard>
