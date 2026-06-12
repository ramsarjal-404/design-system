import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Interactive chip matching the Figma "Tag" component (node 9:8).

## Overview

\`Tag\` is a bordered pill for objects the **user put there** — applied filters, selected servers,
chosen recipients — optionally dismissible via the "×" button. Pass \`onRemove\` and the dismiss
button appears; \`disabled\` grays the tag out and blocks dismissal (the Figma "Disabled Tag"
variant).

### Tag vs Badge

The two share the same pill shape and the same \`component/status/*\` colors, but they are
different components on purpose:

- **Badge** — read-only. The *system* says something about an object ("Healthy", "3 errors").
  Inert by design: no focus, no interaction.
- **Tag** — interactive. The *user* owns the element and can remove it. The "×" is a real
  \`<button>\` with a focus ring and an accessible label, and \`disabled\` exists because
  interaction exists.

If you only need to display status, use **Badge**. Reach for **Tag** when "can the user take
this off?" is a sensible question.

The Figma frame draws the tag colors as flat hexes (#d93b3b, #366251, #ac7f2a) that differ
slightly from the Badge status tokens; in code both components bind to the same
\`component/status/*\` variables so the palettes can never drift apart.

## Anatomy

- **Pill** — 28px radius, 15px/5px padding, 1px border in the status color (\`currentColor\`).
- **Label** — semibold 14/19 (\`--typography-nav-*\`), tinted by variant.
- **Dismiss button** (with \`onRemove\`) — 16px circular hit area, 8px "×", hover tint and
  brand focus ring.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Shape / padding / gap | \`--component-badge-radius\` / \`-paddingX/Y\` / \`-gap\` | 28px / 15px 5px / 5px |
| Label type | \`--typography-nav-fontSize/lineHeight\` + semibold | 14/19, 600 |
| Error | \`--component-status-error-bg\` / \`-text\` | #FFEBEE / #F72B2B |
| Success | \`--component-status-success-bg\` / \`-text\` | #E8F5E9 / #1CAA52 |
| Warning | \`--component-status-warning-bg\` / \`-text\` | #FFF8E1 / #F57F17 |
| Neutral | \`--component-status-na-bg\` / \`-text\` | #F5F7FD / #555766 |
| Disabled | \`--gray-150\` / \`--color-text-disabled\` | #E0E0E0 / #727171 |

## Accessibility

- The dismiss control is a native \`<button>\` with \`aria-label\` (\`removeLabel\`, default
  "Remove") — name it per item: \`removeLabel="Remove filter: Errors"\`.
- Status is conveyed by the label text, not color alone.
- When a tag is removed, move focus somewhere sensible (the next tag or the input that created
  them) in your handler.

## Usage

- **Do** use Tag for removable user input: applied table filters, multi-select values.
- **Do** pair \`disabled\` with a reason (tooltip/help text) — a chip you can't remove is a question.
- **Don't** use Tag as a status label — that's **Badge**.
- **Don't** make the whole tag clickable; the "×" is the only action.
`;

const meta: Meta<typeof Tag> = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['error', 'success', 'warning', 'neutral'],
      description: 'Status color set — same `component/status/*` tokens as Badge.',
      table: {
        type: { summary: "'error' | 'success' | 'warning' | 'neutral'" },
        defaultValue: { summary: "'neutral'" },
      },
    },
    onRemove: {
      description: 'Render the dismiss "×" and call back when it is activated.',
      table: { type: { summary: '() => void' } },
    },
    removeLabel: {
      control: 'text',
      description: 'Accessible label for the dismiss button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Remove'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Gray out the tag (Figma "Disabled Tag") and block dismissal.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=9-8',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Error: Story = {
  args: { variant: 'error', children: 'Error' },
};

export const Dismissible: Story = {
  args: { variant: 'error', children: 'Error', onRemove: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "Error-with-cross" variant generalized: any variant becomes dismissible by passing `onRemove`.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { children: 'Info', disabled: true, onRemove: () => {} },
  parameters: {
    docs: {
      description: {
        story: 'Disabled grays the pill with the shared disabled tokens and disables the dismiss button.',
      },
    },
  },
};

export const FilterBar: Story = {
  name: 'Filter bar (live)',
  render: () => {
    const [filters, setFilters] = useState(['Errors only', 'Last 24 hours', 'AD-Primary']);
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 420 }}>
        {filters.map((f) => (
          <Tag
            key={f}
            variant="neutral"
            removeLabel={`Remove filter: ${f}`}
            onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
          >
            {f}
          </Tag>
        ))}
        {filters.length === 0 && (
          <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>No filters applied</span>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The canonical Tag use case — applied filters the user can take off one by one.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag variant="error">Error</Tag>
        <Tag variant="error" onRemove={() => {}}>Error</Tag>
      </div>
      <Tag disabled>Info</Tag>
      <Tag variant="success">Error</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="neutral">Neutral</Tag>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The five Figma variants (error, error-with-cross, disabled, success, warning) plus the neutral default, all bound to the shared status tokens.',
      },
    },
  },
};
