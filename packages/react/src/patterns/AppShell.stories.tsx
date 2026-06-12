import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, type SidebarVariant } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Toast } from '../components/Toast';
import { Button } from '../components/Button';

const patternDescription = `
A full-viewport application frame: **Sidebar** rail + page canvas + a dismissible **Toast**.

## Overview

The App Shell pattern shows the outermost chrome every Lepidus screen shares. A \`<Sidebar>\`
(either rail variant) owns primary navigation on the left — clicking an item moves the active
state for real via \`useState\` — and the main region sits on \`--color-background-page\`
(\`--lightblue-50\`) with a page heading and content **Cards**. A success **Toast** is pinned
top-right with \`position: fixed\` and a working \`onClose\` dismiss handler; the "Run restore"
button in the first card re-raises it.

The story runs with \`parameters.layout: 'fullscreen'\` so the shell fills the canvas edge to edge,
exactly as it would in product.

## Composition

- **Sidebar** — \`variant="default"\` (square rail) or \`variant="rounded"\` (capsule rail), with
  inline-SVG icon items (icons inherit \`currentColor\`), a logo header and a settings footer.
- **Card** — two content surfaces in the main region ("Recent Activity" and "System Health").
- **Toast** — \`variant="success"\`, fixed top-right, dismissed through \`onClose\`.
- **Button** — \`primary\` Card action that re-triggers the Toast.

## Design tokens

| Part | CSS variable | Light value |
| --- | --- | --- |
| Main canvas | \`--color-background-page\` | \`--lightblue-50\` |
| Page heading | \`--color-text-dark\` | \`--black\` |
| Supporting copy | \`--color-text-secondary\` | \`--gray-600\` |
| Rail bg / icons | \`--component-nav-bg\` / \`--component-nav-icon-color\` | via the Sidebar component |
| Card surface | \`--component-card-bg\` / \`--component-card-border\` | via the Card component |

## Usage

- **Do** keep exactly one \`active\` Sidebar item and give every item a stable \`key\`.
- **Do** pin Toasts to a single corner (top-right here) and always wire \`onClose\`.
- **Don't** put a second navigation rail in the main region — the shell owns wayfinding.
- **Don't** hard-code the canvas color; \`--color-background-page\` re-themes with the system.
`;

/* Inline SVG icons (GearIcon copied from Sidebar.stories.tsx; the rest follow its
   stroke style). All inherit color via currentColor. */
const GearIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7.5 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 14.5a1.65 1.65 0 0 0-1.5-1H1a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 2.6 8.5a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 3.6a1.65 1.65 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21.4 9H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 9.9 4.3-1.9 7.5-5.3 7.5-9.9v-6L12 2.5Z" />
    <path d="m8.8 11.8 2.2 2.2 4.2-4.5" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v16h16" />
    <path d="M8.5 15.5v-4" />
    <path d="M13 15.5V8" />
    <path d="M17.5 15.5v-6.5" />
  </svg>
);

const NAV = [
  { key: 'home', label: 'Home', icon: <HomeIcon /> },
  { key: 'protect', label: 'Protect', icon: <ShieldIcon /> },
  { key: 'reports', label: 'Reports', icon: <ChartIcon /> },
];

const LogoMark = () => (
  <span
    aria-label="Lepidus"
    style={{
      display: 'inline-flex',
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      background: 'rgba(255, 255, 255, 0.18)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 18,
    }}
  >
    L
  </span>
);

const RailFooter = () => (
  <button
    type="button"
    aria-label="Settings"
    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
  >
    <span style={{ width: 26, height: 26, display: 'inline-flex' }}>
      <GearIcon />
    </span>
  </button>
);

const AppShell = ({ variant = 'default' }: { variant?: SidebarVariant }) => {
  const [activeKey, setActiveKey] = useState('home');
  const [toastOpen, setToastOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        variant={variant}
        header={<LogoMark />}
        footer={<RailFooter />}
        items={NAV.map((n) => ({
          ...n,
          active: n.key === activeKey,
          onClick: () => setActiveKey(n.key),
        }))}
      />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          background: 'var(--color-background-page)',
          padding: 32,
        }}
      >
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 24,
            lineHeight: '32px',
            fontWeight: 700,
            color: 'var(--color-text-dark)',
          }}
        >
          {NAV.find((n) => n.key === activeKey)?.label ?? 'Home'}
        </h1>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: 14,
            lineHeight: '19px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Everything is healthy. Last full audit completed 14 minutes ago.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
          <Card
            title="Recent Activity"
            style={{ flex: '1 1 320px' }}
            footer={
              <Button variant="primary" onClick={() => setToastOpen(true)}>
                Run restore
              </Button>
            }
          >
            3 restore jobs finished overnight and 1 is queued. Open the Data Table pattern for the
            full job list.
          </Card>
          <Card title="System Health" style={{ flex: '1 1 320px' }}>
            All 8 monitored servers are reporting. No permission drift detected in the last 24
            hours.
          </Card>
        </div>
      </main>
      {toastOpen && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000 }}>
          <Toast variant="success" title="Restore complete" onClose={() => setToastOpen(false)}>
            AD-Primary-01 was restored successfully.
          </Toast>
        </div>
      )}
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/App Shell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: patternDescription } },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <AppShell />,
  parameters: {
    docs: {
      description: {
        story:
          'The square-rail shell. Click a rail item to move the active state and retitle the page; dismiss the success Toast with its close button, then re-raise it with "Run restore".',
      },
    },
  },
};

export const RoundedRail: Story = {
  render: () => <AppShell variant="rounded" />,
  parameters: {
    docs: {
      description: {
        story:
          'The same shell on `variant="rounded"` — the capsule rail (85px default width) with the circular dashed-ring active indicator. Everything else, including the Toast wiring, is unchanged.',
      },
    },
  },
};
