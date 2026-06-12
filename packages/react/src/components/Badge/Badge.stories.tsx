import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'neutral'],
      description:
        '`default` = brand pill via `component/badge/{bg,text}`; the status variants map to `component/status/{state}-{bg,text}` (`neutral` → `na`).',
      table: {
        type: { summary: "'default' | 'success' | 'warning' | 'error' | 'neutral'" },
        defaultValue: { summary: "'default'" },
      },
    },
    dot: {
      control: 'boolean',
      description:
        'Show a 6px leading status dot filled with `currentColor` (the variant text color). Ignored when `icon` is set.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      control: false,
      description:
        'Leading 12px icon slot — pass an SVG using `currentColor`. Replaces the dot if both are provided.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: 'text',
      description: 'Badge label (required).',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root `<span>`.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    },
    layout: 'centered',
    docs: {
      description: {
        component: `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Static status pill of the Lepidus design system (Figma file *Lepidus*; bound to the \`component/badge/*\` and \`component/status/*\` token sets).

## Overview

Badge labels the state or category of an object inline — "Active", "Pending", "Failed" — next to table rows, card titles, or list items. The \`default\` variant is the brand pill; \`success\` / \`warning\` / \`error\` / \`neutral\` reuse the shared \`component/status\` palette so badge colors always match status colors elsewhere in the system.

Badge is purely presentational and non-interactive. Do **not** use it for transient feedback after an action (use **Toast**/**Message**), for dismissible filters (use **Chip**), or as a clickable control (use **Button**).

## Anatomy

- **Container** — inline \`<span>\` pill (28px radius, 5px/15px padding, 1px transparent border)
- **Leading dot** (optional) — 6px circle filled with the variant text color
- **Leading icon** (optional) — 12px slot, replaces the dot
- **Label** — Open Sans 12px Semibold, single line

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Default (brand) bg | \`--component-badge-bg\` | \`--color-brand-light\` → \`--lightblue-100\` \`#e4edff\` |
| Default (brand) text | \`--component-badge-text\` | \`--color-text-brand\` → \`--blue-600\` \`#1c4599\` |
| Success bg / text | \`--component-status-success-bg\` / \`-text\` | \`--green-100\` \`#e8f5e9\` / \`--green-400\` \`#1caa52\` |
| Warning bg / text | \`--component-status-warning-bg\` / \`-text\` | \`--orange-100\` \`#fff8e1\` / \`--orange-600\` \`#f57f17\` |
| Error bg / text | \`--component-status-error-bg\` / \`-text\` | \`--red-100\` \`#ffebee\` / \`--red-400\` \`#f72b2b\` |
| Neutral (na) bg / text | \`--component-status-na-bg\` / \`-text\` | \`--gray-50\` \`#f5f7fd\` / \`--gray-600\` \`#555766\` |
| Radius | \`--component-badge-radius\` | \`--radius-badge\` → \`--radius-3xl\` \`28px\` |
| Padding | \`--component-badge-paddingY\` / \`-paddingX\` | \`--space-3\` \`5px\` / \`--space-7\` \`15px\` |
| Font size / weight | \`--component-badge-fontSize\` + \`--font-weight-semibold\` | \`--font-size-12\` \`12px\` / \`600\` |
| Gap | \`--component-badge-gap\` | \`--space-3\` \`5px\` |

## Accessibility

- Renders a plain inline \`<span>\` — no implicit role; the label is read as regular text in document flow.
- Not focusable and has no keyboard behavior; never attach click handlers expecting button semantics.
- The status dot is \`aria-hidden="true"\` — meaning must always be carried by the text label, never by color or the dot alone.
- Icons passed to the \`icon\` slot should be decorative (\`aria-hidden\`) since the label provides the accessible text.
- All variant pairs (status text on light status bg) come from the token palette designed for legible contrast; the \`hc\` theme swaps in higher-contrast values automatically.

## Usage

- **Do** keep labels to one or two words ("Active", "Sync failed") — the pill never wraps.
- **Do** pick the variant by meaning, not by color preference: \`success\` = healthy/complete, \`warning\` = needs attention, \`error\` = failed, \`neutral\` = not applicable/unknown.
- **Do** use the \`dot\` for live presence/health indicators (Online / Away / Offline).
- **Don't** make a Badge interactive — wrap actions in a Button or ActionItem instead.
- **Don't** encode information in color alone; the text must state the status.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: 'default', children: 'Brand' },
  parameters: {
    docs: {
      description: {
        story:
          'Brand pill using the `component/badge` pair: lightblue-100 `#e4edff` background with blue-600 `#1c4599` text, 28px radius and 5/15 padding.',
      },
    },
  },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
  parameters: {
    docs: {
      description: {
        story:
          'Success status — `component/status/success` tokens: green-100 background with green-400 text. Use for healthy, complete, or enabled states.',
      },
    },
  },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
  parameters: {
    docs: {
      description: {
        story:
          'Warning status — `component/status/warning` tokens: orange-100 background with orange-600 text. Use for pending or attention-needed states.',
      },
    },
  },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Failed' },
  parameters: {
    docs: {
      description: {
        story:
          'Error status — `component/status/error` tokens: red-100 background with red-400 text. Use for failed or blocking states.',
      },
    },
  },
};

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'N/A' },
  parameters: {
    docs: {
      description: {
        story:
          'Neutral status — the `component/status/na` ("not applicable") tokens: gray-50 background with gray-600 text. Use for unknown or inapplicable states.',
      },
    },
  },
};

export const WithDot: Story = {
  name: 'With Status Dot',
  args: { variant: 'success', dot: true, children: 'Online' },
  parameters: {
    docs: {
      description: {
        story:
          'Leading 6px dot filled via `currentColor`, so it always matches the variant text token (here green-400). The dot is `aria-hidden`.',
      },
    },
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: { variant: 'success', icon: <CheckIcon />, children: 'Verified' },
  parameters: {
    docs: {
      description: {
        story:
          'Leading 12px icon slot — the icon inherits the variant text color through `currentColor` and replaces the dot when both are set.',
      },
    },
  },
};

export const AllVariants: Story = {
  name: '✦ All Variants',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'All five variants plus the dot treatment side by side — a quick visual diff of the `component/badge` and `component/status/*` token pairs.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Row title="Variants">
        <Badge variant="default">Brand</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Failed</Badge>
        <Badge variant="neutral">N/A</Badge>
      </Row>
      <Row title="With status dot">
        <Badge variant="success" dot>Online</Badge>
        <Badge variant="warning" dot>Away</Badge>
        <Badge variant="error" dot>Offline</Badge>
        <Badge variant="neutral" dot>Unknown</Badge>
      </Row>
    </div>
  ),
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}
