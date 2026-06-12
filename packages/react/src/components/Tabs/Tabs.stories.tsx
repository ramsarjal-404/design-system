import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Pill tabs matching the Figma "Tabs-Style1" component (node 643:6378).

## Overview

\`Tabs\` switches between views in place: the active tab is a brand pill
(\`--component-tabs-active-indicator\`, 50px radius, white label, 80px minimum) and the rest are
semibold brand-blue labels with a 20px rhythm. Works uncontrolled (\`defaultValue\`, first enabled
tab by default) or controlled (\`value\` + \`onChange\`); individual tabs can be \`disabled\`.

Implements the ARIA tabs pattern: \`role="tablist"\`/\`"tab"\`, \`aria-selected\`, roving tabindex,
and Arrow/Home/End keyboard navigation. Give each panel \`role="tabpanel"\`,
\`id={\\\`\${idPrefix}-panel-\${tab.id}\\\`}\` and \`aria-labelledby={\\\`\${idPrefix}-tab-\${tab.id}\\\`}\`
so the wiring matches the generated ids.

Use Tabs for peer views of the same context. For sequential steps use **Stepper**; for
navigating away use **Sidebar** or **Breadcrumb**.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Active pill | \`--component-tabs-active-indicator\` | \`--color-brand-primary\` → #1C4599 |
| Active pill border / radius | \`--color-border-brand\` / \`--radius-button\` | #1C4599 / 50px |
| Active label | \`--color-text-inverse\` | white |
| Inactive label | \`--component-tabs-active-text\` | \`--color-text-brand\` → #1C4599 |
| Disabled label | \`--color-text-disabled\` | #727171 |
| Label type | \`--typography-nav-*\` + semibold | 14/19, 600 |
| Gap / padding | \`--space-9\` / \`--space-3\`,\`--space-5\`,\`--space-10\` | 20px / 5·10·24px |

> Note: the frame binds *inactive* labels to \`--component-tabs-active-text\` — the gray
> \`--component-tabs-text\` token goes unused by this style. Worth renaming or rebinding in the
> token source ("Style1" in the frame name suggests more tab styles are coming).

## Accessibility

- Full keyboard support: Tab lands on the active tab, Left/Right cycle, Home/End jump.
- Selection follows focus on arrow keys (standard for tabs whose panels render instantly).
- Active state is conveyed by the filled pill, not color alone.
`;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'activity', label: 'Activity' },
  { id: 'settings', label: 'Settings' },
];

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    tabs: { description: 'Tab definitions (`id`, `label`, `disabled?`).', table: { type: { summary: 'TabItem[]' } } },
    value: { control: 'text', description: 'Controlled active tab id.' },
    defaultValue: { control: 'text', description: 'Uncontrolled initial tab (default: first enabled).' },
    onChange: { table: { type: { summary: '(id: string) => void' } } },
    idPrefix: {
      control: 'text',
      description: 'Prefix for generated tab/panel ids.',
      table: { defaultValue: { summary: "'lds-tabs'" } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=643-6378',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: { tabs: TABS },
};

export const WithDisabled: Story = {
  name: 'With disabled tab',
  args: {
    tabs: [...TABS.slice(0, 3), { id: 'admin', label: 'Admin', disabled: true }],
  },
};

export const WithPanels: Story = {
  name: 'With panels (controlled)',
  render: () => {
    const [tab, setTab] = useState('overview');
    return (
      <div style={{ width: 520 }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} idPrefix="demo" />
        {TABS.map(({ id, label }) => (
          <div
            key={id}
            role="tabpanel"
            id={`demo-panel-${id}`}
            aria-labelledby={`demo-tab-${id}`}
            hidden={tab !== id}
            style={{
              padding: 20,
              fontFamily: 'var(--font-family-primary)',
              fontSize: 14,
              color: 'var(--color-text-primary)',
            }}
          >
            {label} content goes here.
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled tabs wired to real `tabpanel`s using the generated ids — the full ARIA contract.',
      },
    },
  },
};
