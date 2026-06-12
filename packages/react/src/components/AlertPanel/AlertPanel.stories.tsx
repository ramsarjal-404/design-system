import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertPanel } from './AlertPanel';
import { Button } from '../Button';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Page-level alert announcement matching the Figma frame (node 2290:3737).

## Overview

\`AlertPanel\` is the heaviest of the three feedback weights — **Toast** (transient) → **Message**
(inline strip) → **AlertPanel** (standing announcement). Use it when an alert deserves the full
stage: an alert detail view, a notification landing page, or the web rendering of an alert
notification. The severity triangle, "Attention!" headline, alert name, rich summary, optional
evidence slot, CTA and footnote are all slots — pass a primary **Button** as \`action\` and any
markup (a small table, key/value grid) as \`details\`.

It announces itself to assistive tech via \`role="alert"\`.

## Design tokens & reconciliations

| Part | Binding |
| --- | --- |
| Card | \`--color-background-surface\`, \`--radius-m\`, soft shadow from the frame |
| Headline | 64px bold \`--color-text-primary\` (Figma literal — type scale tops out at 32; flagged) |
| Title / summary | \`--typography-body-lg\` in \`--color-text-dark\` (frame's 17px summary reconciled to 16) |
| Footnote | \`--typography-body-md\` in \`--color-text-primary\` |
| Triangle | warning #FFCA28 (illustrative, tokenless), success/error/info → status + brand tokens |
| CTA | the frame's one-off cyan (#2E98D4) is not a system color — use the primary **Button** |

## Usage

- **Do** bold the variable facts in the summary ("**5 change(s)**", "**File Server**").
- **Do** keep \`details\` to a handful of evidence rows; link to the full report via \`action\`.
- **Don't** use AlertPanel for inline form feedback (**Message**) or fleeting confirmation (**Toast**).
- **Don't** stack more than one AlertPanel in a viewport — it's an announcement, not a feed item.
`;

const cell: CSSProperties = {
  padding: '5px 6px',
  fontSize: 'var(--typography-body-sm-fontSize, 12px)',
  lineHeight: 'var(--typography-body-sm-lineHeight, 16px)',
  color: 'var(--color-text-primary, #364765)',
  border: '1px solid var(--color-text-primary, #364765)',
  textAlign: 'left',
};

const DetailsTable = () => (
  <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-family-primary)' }}>
    <thead>
      <tr>
        {['Account Name', 'Script Name', 'Status'].map((h) => (
          <th key={h} style={{ ...cell, fontWeight: 400, background: 'var(--color-background-subtle, #f3f3f3)' }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[
        ['Administrator', '\\\\192.168.30.206\\share206\\Ram Srjal', 'Success'],
        ['Administrator', '\\\\192.168.30.236\\share206\\Ram Srjal', 'Success'],
      ].map((row, i) => (
        <tr key={i}>
          {row.map((c, j) => (
            <td key={j} style={{ ...cell, background: 'var(--lightblue-200, #ddf3ff)' }}>
              {c}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const meta: Meta<typeof AlertPanel> = {
  title: 'Feedback/Alert Panel',
  component: AlertPanel,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'inline-radio',
      options: ['warning', 'success', 'error', 'info'],
      description: 'Triangle color — yellow / status green / status red / brand blue.',
      table: { type: { summary: "'warning' | 'success' | 'error' | 'info'" }, defaultValue: { summary: "'warning'" } },
    },
    headline: {
      control: 'text',
      description: 'Big headline under the triangle.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: "'Attention!'" } },
    },
    title: { control: 'text', description: 'The alert name.', table: { type: { summary: 'ReactNode' } } },
    children: { description: 'Rich summary (bold the variable facts).', table: { type: { summary: 'ReactNode' } } },
    details: { description: 'Evidence slot between summary and action.', table: { type: { summary: 'ReactNode' } } },
    action: { description: 'Call to action (primary Button).', table: { type: { summary: 'ReactNode' } } },
    footnote: { control: 'text', description: 'Small line under the action.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=2290-3737',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof AlertPanel>;

export const WithDetails: Story = {
  name: 'Warning with details (Figma frame)',
  args: {
    severity: 'warning',
    title: 'Mass files copied',
    children: (
      <>
        You have received this alert because <strong>5 change(s)</strong> have been made in your{' '}
        <strong>File Server</strong> and <strong>Script execution</strong> was initiated.
      </>
    ),
    details: <DetailsTable />,
    action: <Button variant="primary">View Report</Button>,
    footnote: 'Now you can check the report directly on LDSP web - console',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
    title: 'Mass files copied',
    children: (
      <>
        You have received this alert because <strong>5 change(s)</strong> have been made in your{' '}
        <strong>File Server</strong>
      </>
    ),
    action: <Button variant="primary">View Report</Button>,
    footnote: 'Now you can check the report directly on LDSP web - console',
  },
  parameters: {
    docs: { description: { story: 'The second Figma variant — green triangle, no evidence table.' } },
  },
};

export const AllSeverities: Story = {
  name: '✦ All severities',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {(['warning', 'success', 'error', 'info'] as const).map((s) => (
        <AlertPanel key={s} severity={s} title="Mass files copied" headline="Attention!">
          Severity: <strong>{s}</strong>
        </AlertPanel>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The two Figma severities plus error and info, extended with the shared status/brand tokens.',
      },
    },
  },
};
