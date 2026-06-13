import { GaugeChart, ChartCard } from '@ramsarjal-404/react';

// non-percentage scale: formatValue keeps the value, max bound, and tooltip in TB
<ChartCard title="Archive Storage">
  <GaugeChart
    value={6.4}
    max={8}
    label="Capacity Used"
    size={170}
    thickness={14}
    formatValue={(v) => v + ' TB'}
    aria-label="Archive storage: 6.4 of 8 terabytes used"
  />
</ChartCard>
