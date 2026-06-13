import { BubbleChart, ChartCard } from '@ramsarjal-404/react';

// xMax/yMax pin the scales so several charts can share axes
<ChartCard title="Risk vs Exposure">
  <BubbleChart
    series={[
      {
        name: 'Open shares',
        points: [
          { x: 20, y: 65, r: 18, label: 'Finance' },
          { x: 45, y: 40, r: 12, label: 'HR' },
        ],
      },
      {
        name: 'Stale accounts',
        points: [
          { x: 70, y: 80, r: 22, label: 'Contractors' },
          { x: 55, y: 25, r: 9, label: 'Service accounts' },
        ],
      },
    ]}
    xMax={100}
    yMax={100}
    height={200}
  />
</ChartCard>
