import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPanel } from './SettingsPanel';
import type { SettingsPanelItem } from './SettingsPanel.types';
import {
  AddDataSourceIcon,
  TrustSettingsIcon,
  IdentifySettingsActiveIcon,
  ProtectSettingsIcon,
  GeneralSettingsIcon,
  RoleManagementActiveIcon,
  LogsIcon,
  BackupRestoreIcon,
  ExportedFilesIcon,
  ApplicationUrlIcon,
  ManageDomainsIcon,
  SubscriptionIcon,
  ConfigureNotificationsIcon,
  LicenseManagementIcon,
  SqlIcon,
  UserServiceSettingIcon,
} from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Settings category menu matching the Figma "side bar pannel" frame (node 797:3469).

## Overview

\`SettingsPanel\` lists the categories of a settings area — a bordered surface with a 20px rounded
top-left corner, the bold "Categories" heading on a divider, and one row per category: a 30px
icon from the Lepidus icon set plus a body-lg label. Selection works uncontrolled
(\`defaultSelectedId\`) or controlled (\`selectedId\` + \`onSelect\`); the active row gets the
brand-light background and brand text, consistent with **FolderTree**.

Compose it as the left column of a settings layout, with the selected category's form on the
right (see the *Settings Form* pattern).

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Surface / border | \`--color-background-surface\` / \`--color-border-strong\` | white / #E2DBDB |
| Top-left radius | \`--radius-xl\` | 20px |
| Heading | \`--typography-heading-h5-*\` bold, \`--component-card-title-text\` | 20/28, #364765 |
| Row label | \`--typography-body-lg-*\`, \`--component-card-title-text\` | 16/22, #364765 |
| Icon | 30px, \`currentColor\` → row color | #364765 / brand when selected |
| Selected row | \`--color-brand-light\` + \`--color-text-brand\` | #E4EDFF + #1C4599 |
| Side padding / rhythm | \`--space-9\` / \`--space-16\` | 20px / 7px |

## Accessibility

- Rows are real buttons in a list; the active row carries \`aria-current\`.
- Icons inherit \`currentColor\` (post icon-pipeline fix), so selected-state tinting is automatic.
- Selection is conveyed by background *and* weight, not color alone.

## Usage

- **Do** keep category labels to 1–3 words; the icon carries recognition.
- **Do** drive the right-hand pane from \`onSelect\` and mark it via \`selectedId\`.
- **Don't** nest categories — this is a flat menu; for two-level trees use **FolderTree**.
`;

const ITEMS: SettingsPanelItem[] = [
  { id: 'add-data-source', label: 'Add Data Source', icon: <AddDataSourceIcon size={30} /> },
  { id: 'trust', label: 'Trust Settings', icon: <TrustSettingsIcon size={30} /> },
  { id: 'identify', label: 'Identify Settings', icon: <IdentifySettingsActiveIcon size={30} /> },
  { id: 'protect', label: 'Protect Settings', icon: <ProtectSettingsIcon size={30} /> },
  { id: 'general', label: 'General Settings', icon: <GeneralSettingsIcon size={30} /> },
  { id: 'roles', label: 'Role management', icon: <RoleManagementActiveIcon size={30} /> },
  { id: 'logs', label: 'Logs', icon: <LogsIcon size={30} /> },
  { id: 'backup', label: 'Backup & Restore', icon: <BackupRestoreIcon size={30} /> },
  { id: 'exported', label: 'Exported Files', icon: <ExportedFilesIcon size={30} /> },
  { id: 'app-url', label: 'Application URL', icon: <ApplicationUrlIcon size={30} /> },
  { id: 'domains', label: 'Manage Domains', icon: <ManageDomainsIcon size={30} /> },
  { id: 'subscription', label: 'Subscription', icon: <SubscriptionIcon size={30} /> },
  { id: 'notifications', label: 'Configure Notifications', icon: <ConfigureNotificationsIcon size={30} /> },
  { id: 'license', label: 'License Management', icon: <LicenseManagementIcon size={30} /> },
  { id: 'sql', label: 'SQL Authentication', icon: <SqlIcon size={30} /> },
  { id: 'user-service', label: 'User Service Settings', icon: <UserServiceSettingIcon size={30} /> },
];

const meta: Meta<typeof SettingsPanel> = {
  title: 'Navigation/Settings Panel',
  component: SettingsPanel,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Panel heading.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: "'Categories'" } },
    },
    items: { description: 'Categories (`id`, `label`, `icon?`).', table: { type: { summary: 'SettingsPanelItem[]' } } },
    selectedId: { control: 'text', description: 'Controlled active category.' },
    defaultSelectedId: { control: 'text', description: 'Uncontrolled initial category.' },
    onSelect: { table: { type: { summary: '(id: string) => void' } } },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=797-3469',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsPanel>;

export const Default: Story = {
  name: 'Default (Figma frame)',
  args: { items: ITEMS },
};

export const WithSelection: Story = {
  name: 'With selection',
  args: { items: ITEMS, defaultSelectedId: 'roles' },
};

export const SettingsLayout: Story = {
  name: 'Settings layout (live)',
  render: () => {
    const [selected, setSelected] = useState('general');
    const current = ITEMS.find((i) => i.id === selected);
    return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <SettingsPanel items={ITEMS} selectedId={selected} onSelect={setSelected} />
        <div
          style={{
            flex: 1,
            padding: 24,
            background: 'var(--color-background-surface)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-m, 12px)',
            fontFamily: 'var(--font-family-primary)',
            color: 'var(--color-text-primary)',
            minHeight: 220,
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>{current?.label}</h3>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            The {String(current?.label)} form renders here.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The intended composition — the panel drives the settings pane on the right.',
      },
    },
  },
};
