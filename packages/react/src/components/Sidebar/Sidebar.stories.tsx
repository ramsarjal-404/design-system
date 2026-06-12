import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import type { SidebarItem } from './Sidebar.types';
import {
  LepideLogo,
  LepideAiIcon,
  AuditorIcon,
  TrustIcon,
  DetectIcon,
  ProtectIcon,
  IdentifyIcon,
  MyLepideIcon,
  DashboardIcon,
} from './lepideIcons';

const GearIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7.5 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 14.5a1.65 1.65 0 0 0-1.5-1H1a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 2.6 8.5a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 3.6a1.65 1.65 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21.4 9H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>);

const NAV: Omit<SidebarItem, 'active'>[] = [
  { key: 'ai', label: 'Lepide AI', icon: <LepideAiIcon /> },
  { key: 'auditor', label: 'Auditor', icon: <AuditorIcon /> },
  { key: 'trust', label: 'Trust', icon: <TrustIcon /> },
  { key: 'detect', label: 'Detect', icon: <DetectIcon /> },
  { key: 'protect', label: 'Protect', icon: <ProtectIcon /> },
  { key: 'identify', label: 'Identify', icon: <IdentifyIcon /> },
  { key: 'mylepide', label: 'My Lepide', icon: <MyLepideIcon /> },
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
];

const LogoMark = () => <LepideLogo />;

const Footer = () => (
  <>
    <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} aria-label="Settings">
      <span style={{ display: 'flex', width: 49, height: 49, alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 26, height: 26, display: 'inline-flex' }}><GearIcon /></span>
      </span>
    </button>
    <span aria-label="Account" style={{ width: 34, height: 34, borderRadius: 9999, background: '#2E98D4', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>R</span>
  </>
);

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'rounded'],
      description:
        "Rail shape — 'default' square rail, or 'rounded' capsule rail (Figma node 557:382) with a circular #11337A dashed-ring active indicator.",
      table: { type: { summary: "'default' | 'rounded'" }, defaultValue: { summary: "'default'" } },
    },
    items: {
      control: false,
      description:
        'Navigation items. Each `SidebarItem` needs a stable `key`, `label` and `icon`, plus optional `active`, `disabled`, `href` (renders an `<a>`) and `onClick` (renders a `<button>` when no href).',
      table: { type: { summary: 'SidebarItem[]' } },
    },
    header: {
      control: false,
      description: 'Top slot, centered above the item list — typically the product logo.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      control: false,
      description: 'Bottom slot pinned to the rail end via `margin-top: auto` — e.g. settings button + avatar.',
      table: { type: { summary: 'ReactNode' } },
    },
    width: {
      control: 'number',
      description: 'Rail width — a number (px) or any CSS length string. 100px matches the Figma frame.',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: '100' } },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the `<nav>` landmark; distinguishes it from other navs on the page.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Primary'" } },
    },
  },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=557-382',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Vertical icon-rail navigation (the Lepide AI sidebar), driven end-to-end by **component/nav/** tokens.

## Overview

\`Sidebar\` is the app-level primary navigation rail: a fixed-width brand-blue column of icon + label items with optional header (logo) and footer (settings/avatar) slots. Use it as the single \`<nav>\` landmark for top-level product areas (Auditor, Trust, Detect, …), with exactly one item marked \`active\`.

It is not a generic menu: for in-page or contextual navigation (tabs, dropdowns, breadcrumbs) use the dedicated components rather than nesting rails. For decision-driving feedback inside the content area, reach for **Message**; for passive notifications, **Toast**.

## Anatomy

- **Rail** — 100px-wide (default) brand-blue \`<nav>\` column spanning the viewport height.
- **Header slot** — centered top area for the product logo.
- **Item list** — \`<ul>\` of items, each a 49px icon square (\`radius/ms\`) above a 14px label; the list scrolls with hidden scrollbars when it overflows.
- **Active square** — the selected item's icon box fills white with the icon tinted cyan.
- **Footer slot** — pinned to the bottom (settings, account avatar, etc.).

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Rail background | \`--component-nav-sidebar-bg\` | #1C4599 |
| Icons + labels | \`--component-nav-icon-color\` | #FFFFFF |
| Active square bg | \`--component-nav-item-bg\` | #FFFFFF |
| Active icon tint | \`--component-nav-item-active-text\` | #2E98D4 |
| Icon-box radius | \`--radius-ms\` | 9px |
| Label type | \`--component-nav-fontSize\` / \`--component-nav-lineHeight\` | 14px / 19px |
| Rail padding | \`--space-9\` / \`--space-4\` | 20px / 8px |
| Item gap | \`--space-7\` | 15px |

## States & variants

- **Default item** — white icon + label on the brand rail; hover shows a faint translucent square.
- **Active** (\`item.active\`) — white \`component/nav/item-bg\` square with the icon in \`component/nav/item-active-text\` cyan; also sets \`aria-current="page"\`.
- **Disabled** (\`item.disabled\`) — 45% opacity, \`cursor: not-allowed\`; buttons get \`disabled\`, links drop their \`href\` and set \`aria-disabled\`.
- **Link vs button** — \`item.href\` renders an \`<a>\`; otherwise an \`onClick\` \`<button>\`.
- **Width** — any CSS length via \`width\` (default 100px; 85px for the rounded variant).
- **Rounded** (\`variant="rounded"\`, Figma 557:382) — capsule rail with a \`component/nav/rounded-border\` stroke (#E2DBDB); items tighten to 24px gaps with 12px semibold labels, and the active item becomes a 50px circle filled with \`component/nav/rounded-selected-bg\` (#11337A — the Figma "Rounded-sidebar-selected" style) inside a dashed \`component/nav/rounded-selected-border\` ring (#F6F6F6).

## Accessibility

- The root is a \`<nav>\` landmark named by \`ariaLabel\` (default "Primary"); items live in a semantic \`<ul>\`/\`<li>\` list.
- Each item is a native \`<a>\` or \`<button>\`, so it is keyboard-focusable and Enter/Space-operable for free.
- The selected item exposes \`aria-current="page"\`; disabled links also set \`aria-disabled\` and remove the \`href\`.
- \`:focus-visible\` draws a white ring around the icon square, keeping focus visible on the dark rail.
- Icons should be decorative (\`aria-hidden\`) since every item carries a visible text label.

## Usage

- **Do** keep exactly one \`active\` item and keep labels to one or two short words.
- **Do** prefer \`href\` items for real routes so the rail works with browser navigation and middle-click.
- **Do** give each item a stable \`key\` — the list re-renders on selection changes.
- **Don't** exceed roughly 8–9 top-level items; the rail has no grouping or overflow affordance.
- **Don't** place focusable content in \`header\`/\`footer\` without its own accessible name (e.g. \`aria-label\` on icon-only buttons).`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div style={{ height: '100vh', minHeight: 880, display: 'flex' }}>
      <Sidebar
        header={<LogoMark />}
        footer={<Footer />}
        items={NAV.map((n, i) => ({ ...n, active: i === 1 }))}
      />
      <div style={{ flex: 1, background: '#F5F7FD' }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The full Lepide AI rail: logo header, eight nav items with "Auditor" active (white square + cyan icon), and a settings + avatar footer pinned to the bottom.',
      },
    },
  },
};

export const Rounded: Story = {
  render: () => {
    const [active, setActive] = useState('auditor');
    return (
      <div style={{ minHeight: 880, display: 'flex', padding: 16, background: '#F5F7FD', boxSizing: 'border-box' }}>
        <Sidebar
          variant="rounded"
          items={NAV.map((n) => ({ ...n, active: n.key === active, onClick: () => setActive(n.key) }))}
        />
        <div style={{ flex: 1 }} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The capsule rail from Figma node 557:382 — 85px wide with a subtle stroke; the selected item is a 50px #11337A circle inside a dashed ring, labels at 12px semibold. Click items to move the selection.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState('auditor');
    return (
      <div style={{ height: '100vh', minHeight: 880, display: 'flex' }}>
        <Sidebar
          header={<LogoMark />}
          footer={<Footer />}
          items={NAV.map((n) => ({ ...n, active: n.key === active, onClick: () => setActive(n.key) }))}
        />
        <div style={{ flex: 1, background: '#F5F7FD', padding: 32, fontFamily: 'Open Sans, sans-serif', color: '#364765' }}>
          <h2 style={{ margin: 0 }}>{NAV.find((n) => n.key === active)?.label}</h2>
          <p style={{ color: '#555766' }}>Click an item in the rail — the white-square active state follows your selection.</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Stateful selection demo: items are `onClick` buttons and the `active` flag (with `aria-current="page"`) follows the clicked item.',
      },
    },
  },
};
