import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ChartCard,
  BarChart,
  ColumnChart,
  BubbleChart,
  LineChart,
  DonutChart,
  ChartLegend,
  CHART_COLORS,
} from '../components/Charts';
import { Breadcrumb } from '../components/Breadcrumb';
import { Dropdown } from '../components/Dropdown';
import { Sidebar } from '../components/Sidebar';
import {
  LepideAiIcon,
  AuditorIcon,
  TrustIcon,
  DetectIcon,
  ProtectIcon,
  IdentifyIcon,
  MyLepideIcon,
  DashboardIcon,
  LepideLogo,
} from '../components/Sidebar/lepideIcons';
import { CalenderIcon, RefreshIcon } from '../icons';

const patternDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The Auditor dashboard matching the Design Essentials frame
([node 29:9720](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=29-9720)):
six chart cards on the Lepide shell, all composed from the **Charts** kit, with a working
dashboard switcher and refresh. Every state is functional.

## Composition & behavior

- **Header** — "Dashboard- {name}" title (frame's 34px reconciled to the 32px h1 token), the
  \`--color-button-secondary-bg\` name chip, the **Breadcrumb** (Dashboard / {name}), and on the
  right the "Dashboards List" **Dropdown** — switching it retitles the page, chip and breadcrumb —
  plus a refresh button that re-seeds every chart's data.
- **Chart grid** — six **ChartCard**s (soft shadow per this frame; the calendar icon in the
  actions slot), 2 columns responsive:
  | Card | Chart |
  | --- | --- |
  | Failed File Read | **LineChart** with \`area\` over date labels |
  | Failed Logins | horizontal **BarChart**, FS1–FS7, red/yellow series |
  | Data Being Shared | **DonutChart** with center stat ("2,483 / Data") |
  | Top 10 Admins | **ColumnChart** with \`colorByCategory\` (the frame's multicolor columns) |
  | Security Group Changes | **BubbleChart** (added to the kit from this frame) |
  | New MS Teams Channel Created | **ColumnChart** \`stacked\` (red/yellow/green) |

## Anatomy → token bindings

| Part | Binding (Figma → code) |
| --- | --- |
| Canvas | \`--color-background-subtle\` (frame #F4F6FC ≈ \`--lightblue-50\` — flagged) |
| Title | h1 \`--typography-heading-h1\` in \`--color-text-brand\` (frame literal 34 — flagged) |
| Name chip | \`--color-button-secondary-bg\`, \`--radius-button\`, body-lg \`--color-icon-default\` |
| Cards | **ChartCard** tokens + this frame's soft shadow and 26px radius (≈ \`--radius-input\` 25 — flagged) |
| Charts | the kit's shared palette and token chains, unchanged |
| Breadcrumb / Dropdown / Sidebar | their component tokens, unchanged |

## Accessibility

- Every chart is \`role="img"\` with tooltips on bars/points/segments/bubbles; legends stay
  visible since color alone separates series.
- The refresh control is a labeled button; the dashboard switcher is the stock Dropdown.

## Usage

- **Do** drive all six cards from one data layer keyed by the selected dashboard.
- **Do** keep one chart type per question (trend → line, comparison → bar/column,
  composition → donut, magnitude → bubble).
- **Don't** add cards beyond a 3×2 grid per dashboard — split into a new dashboard instead.
`;

/* ---------- seeded data (refresh re-seeds) ---------- */

const rot = <T,>(arr: T[], seed: number) => arr.map((_, i) => arr[(i + seed) % arr.length]);

const useDashboardData = (seed: number) =>
  useMemo(() => {
    const dates = ['20-11-2024', '21-11-2024', '24-11-2024', '26-11-2024', '28-11-2024'];
    return {
      fileRead: { labels: dates, values: rot([25, 85, 42, 78, 45], seed) },
      logins: [
        { name: 'Failed', values: rot([110, 180, 90, 200, 60, 140, 75], seed) },
        { name: 'Attempts', values: rot([260, 90, 150, 280, 120, 200, 95], seed) },
      ],
      shared: rot([
        { label: 'FS 1', value: 980, color: CHART_COLORS[1] },
        { label: 'FS 2', value: 820, color: CHART_COLORS[0] },
        { label: 'FS 3', value: 683, color: CHART_COLORS[2] },
      ], seed),
      admins: rot([850, 380, 580, 580, 1000, 690], seed),
      teams: [
        { name: 'FS1', values: rot([220, 150, 320, 120, 180, 140], seed) },
        { name: 'FS2', values: rot([180, 120, 160, 90, 150, 110], seed) },
        { name: 'FS3', values: rot([260, 130, 380, 160, 240, 170], seed) },
      ],
      bubbles: [
        { name: 'Product 1', points: [{ x: 12 + seed, y: 30, r: 24 }, { x: 28, y: 55 + seed, r: 14 }, { x: 44, y: 38, r: 10 }] },
        { name: 'Product 2', points: [{ x: 35, y: 72, r: 12 }, { x: 58 + seed, y: 48, r: 23 }, { x: 70, y: 80, r: 16 }] },
        { name: 'Product 3', points: [{ x: 82, y: 35 + seed, r: 21 }, { x: 90, y: 62, r: 13 }, { x: 64, y: 22, r: 10 }] },
      ],
    };
  }, [seed]);

const UPDATED = 'Last Updated on 21/08/2022 1:08 PM';

const cardShadow = { boxShadow: '0 1.8px 9.2px rgba(0, 0, 0, 0.1)' };

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState('Auditor');
  const [seed, setSeed] = useState(0);
  const data = useDashboardData(seed);

  const legend = (names: string[]) => (
    <ChartLegend items={names.map((n, i) => ({ label: n, color: CHART_COLORS[i] }))} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-family-primary)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--typography-heading-h1-fontSize, 32px)',
              lineHeight: 'var(--typography-heading-h1-lineHeight, 36px)',
              fontWeight: 600,
              color: 'var(--color-text-brand, #1c4599)',
            }}
          >
            Dashboard- {dashboard}
          </h1>
          <span
            style={{
              display: 'inline-flex',
              marginTop: 14,
              padding: '5px 30px',
              background: 'var(--color-button-secondary-bg, #c6d8ff)',
              borderRadius: 'var(--radius-button, 50px)',
              fontSize: 'var(--typography-body-lg-fontSize, 16px)',
              color: 'var(--color-icon-default, #0a1959)',
            }}
          >
            Dashboard Name- {dashboard}
          </span>
          <Breadcrumb style={{ marginTop: 4 }} items={[{ label: 'Dashboard', href: '#' }, { label: dashboard }]} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary, #364765)', whiteSpace: 'nowrap' }}>
            Dashboards List
          </span>
          <div style={{ width: 320 }}>
            <Dropdown
              options={[{ value: 'Auditor' }, { value: 'Trust' }, { value: 'Detect' }]}
              value={dashboard}
              onChange={(v) => setDashboard(v as string)}
            />
          </div>
          <button
            type="button"
            aria-label="Refresh dashboard"
            onClick={() => setSeed((s) => s + 1)}
            style={{
              width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'none', cursor: 'pointer',
              color: 'var(--color-text-brand, #1c4599)', borderRadius: 'var(--radius-3xs, 3px)',
            }}
          >
            <RefreshIcon size={28} />
          </button>
        </div>
      </div>

      {/* chart grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(540px, 1fr))', gap: 20 }}>
        <ChartCard fullWidth title="Failed File Read" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <LineChart labels={data.fileRead.labels} series={[{ name: 'Failed reads', values: data.fileRead.values, color: CHART_COLORS[2] }]} area height={210} />
        </ChartCard>

        <ChartCard fullWidth title="Failed Logins" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <BarChart categories={['FS1', 'FS2', 'FS3', 'FS4', 'FS5', 'FS6', 'FS7']} series={data.logins} ticks={5} />
          {legend(['Failed', 'Attempts'])}
        </ChartCard>

        <ChartCard fullWidth title="Data Being Shared" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart data={data.shared} centerValue="2,483" centerLabel="Data" size={190} thickness={26} />
          </div>
        </ChartCard>

        <ChartCard fullWidth title="Top 10 Admins" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <ColumnChart
            categories={['LDSP1', 'LDSP2', 'LDSP3', 'LDSP4', 'LDSP5', 'LDSP6']}
            series={[{ name: 'Changes', values: data.admins }]}
            colorByCategory
            columnWidth={22}
            height={210}
          />
        </ChartCard>

        <ChartCard fullWidth title="Security Group Changes" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <BubbleChart series={data.bubbles} height={210} />
          {legend(['Product 1', 'Product 2', 'Product 3'])}
        </ChartCard>

        <ChartCard fullWidth title="New MS Teams Channel Created" lastUpdated={UPDATED} actions={<CalenderIcon size={24} />} style={cardShadow}>
          <ColumnChart
            categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            series={data.teams}
            stacked
            columnWidth={20}
            height={210}
          />
          {legend(['FS1', 'FS2', 'FS3'])}
        </ChartCard>
      </div>
    </div>
  );
};

const FullShellPage = () => {
  const [activeKey, setActiveKey] = useState('dashboard');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-subtle, #f4f6fc)' }}>
      <Sidebar
        header={<LepideLogo />}
        style={{ flexShrink: 0 }}
        items={[
          { key: 'ai', label: 'Lepide AI', icon: <LepideAiIcon /> },
          { key: 'auditor', label: 'Auditor', icon: <AuditorIcon /> },
          { key: 'trust', label: 'Trust', icon: <TrustIcon /> },
          { key: 'detect', label: 'Detect', icon: <DetectIcon /> },
          { key: 'protect', label: 'Protect', icon: <ProtectIcon /> },
          { key: 'identify', label: 'Identify', icon: <IdentifyIcon /> },
          { key: 'mylepide', label: 'My Lepide', icon: <MyLepideIcon /> },
          { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        ].map((n) => ({ ...n, active: n.key === activeKey, onClick: () => setActiveKey(n.key) }))}
      />
      <main style={{ flex: 1, minWidth: 0, padding: '20px 28px' }}>
        <DashboardPage />
      </main>
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=29-9720',
    },
    docs: { description: { component: patternDescription } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <FullShellPage />,
};
