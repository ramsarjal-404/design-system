import { GaugeChart, ChartCard, CHART_COLORS } from '@lepidus/react';

// first entry whose upTo >= value wins; CHART_COLORS keeps bands themable
// (CHART_COLORS[2] green, [1] yellow, [0] red — the --color-chart-series-* tokens)
<ChartCard title="Risk Levels">
  <GaugeChart
    value={74}
    label="Risk Score"
    thresholds={[
      { upTo: 60, color: CHART_COLORS[2] },
      { upTo: 85, color: CHART_COLORS[1] },
      { upTo: 100, color: CHART_COLORS[0] },
    ]}
    aria-label="Risk score: 74 of 100"
  />
</ChartCard>
