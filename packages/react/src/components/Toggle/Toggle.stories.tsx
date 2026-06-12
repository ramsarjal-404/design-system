import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

On/off switch matching the Figma "Toggle" component (node 9:24).

## Overview

\`Toggle\` flips a single setting on or off with immediate effect — agent enabled, notifications
on, dark mode. It renders a native \`<button role="switch">\`, works uncontrolled
(\`defaultChecked\`) or controlled (\`checked\` + \`onChange\`), and covers all four Figma variants:
on, off, and the gray disabled pair.

Use Toggle when the change applies instantly. If the choice is collected and submitted with a
form, that's a checkbox; if it's one-of-many, that's **Dropdown** or radio.

## Anatomy

- **Track** — 56×20 pill (\`--radius-4xl\`), brand blue when on, light blue when off, gray when
  disabled, with a 1px border one shade deeper than the fill.
- **Thumb** — 15px white circle (\`--component-toggle-handle\`) with a soft drop shadow, sliding
  between ends in 180ms.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Track (on) | \`--component-toggle-on-bg\` | \`--blue-600\` → #1C4599 |
| Border (on) | \`--blue-650\` | #11337A |
| Track (off) | \`--component-toggle-off-bg\` | \`--color-brand-secondary\` → \`--blue-200\` → #C6D8FF |
| Border (off) | \`--color-border-brand\` | \`--blue-600\` → #1C4599 |
| Track (disabled) | \`--component-toggle-disabled-bg\` | \`--gray-400\` → #C6C6C6 |
| Border (disabled) | \`--color-text-disabled\` | \`--gray-500\` → #727171 |
| Thumb | \`--component-toggle-handle\` | white |
| Track radius | \`--radius-4xl\` | 24px |

> Note: the Figma variable for \`component/toggle/off-bg\` still points at a placeholder gray,
> so the token is rebound to \`semantic.color.brand.secondary\` (the #CADBFF the node draws) in
> \`packages/tokens/src/figma-gaps.tokens.json\`. Once the Figma variable is fixed, delete the
> override there.

## Accessibility

- Native \`<button role="switch" aria-checked>\` — toggles with click, Space and Enter, and
  announces "on"/"off" to screen readers.
- The switch is text-free: always name it with \`aria-label\` ("Enable notifications") or pair it
  with a visible \`<label>\` and \`aria-labelledby\`.
- State is conveyed by thumb position *and* track color, with a brand focus ring.

## Usage

- **Do** apply the change immediately when the switch flips — no Save button.
- **Do** keep the label phrased as the thing being switched ("Auto-backup"), not the state ("On").
- **Don't** use Toggle inside form submissions — use a checkbox.
- **Don't** disable a toggle without explaining why nearby.
`;

const meta: Meta<typeof Toggle> = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled on/off state. Pair with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Uncontrolled initial state.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: {
      description: 'Called with the next state when the user flips the switch.',
      table: { type: { summary: '(checked: boolean) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — gray track in both positions.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=9-24',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const On: Story = {
  args: { defaultChecked: true, 'aria-label': 'Example setting' },
};

export const Off: Story = {
  args: { 'aria-label': 'Example setting' },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Toggle disabled defaultChecked aria-label="Disabled on" />
      <Toggle disabled aria-label="Disabled off" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The Figma "Disabled on" / "Disabled Off" variants — gray track, interaction blocked.',
      },
    },
  },
};

export const WithLabel: Story = {
  name: 'With label (controlled)',
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-family-primary)',
          fontSize: 14,
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
        }}
      >
        <Toggle checked={on} onChange={setOn} aria-label="Auto-backup" />
        Auto-backup {on ? 'enabled' : 'disabled'}
      </label>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled usage paired with a visible label — the canonical settings-row pattern.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Toggle defaultChecked aria-label="On" />
      <Toggle aria-label="Off" />
      <Toggle disabled aria-label="Disabled off" />
      <Toggle disabled defaultChecked aria-label="Disabled on" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The four Figma variants stacked: on, off, disabled off, disabled on.',
      },
    },
  },
};
