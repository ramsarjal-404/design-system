import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Input } from '../Input';

const meta: Meta<typeof Card> = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description:
        'Optional title rendered in the header row with the `component/card/title-text` token (16px Semibold).',
      table: { type: { summary: 'ReactNode' } },
    },
    actions: {
      control: false,
      description:
        'Optional actions rendered on the right of the title row — typically a Badge or a small Button.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      control: false,
      description:
        'Optional footer row, usually holding Cancel/Confirm Buttons. Laid out as a flex row with an 8px gap.',
      table: { type: { summary: 'ReactNode' } },
    },
    elevated: {
      control: 'boolean',
      description:
        'Raise the card with the `shadow-card/*` tokens (0 2px 9px rgba(0,0,0,0.1)).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    borderless: {
      control: 'boolean',
      description:
        'Hide the 1px default border (sets it transparent) — usually combined with `elevated`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description:
        'Card body content, rendered with the `component/card/body-text` token (14px).',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root `<div>`.',
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

Surface container of the Lepidus design system (Figma file *Lepidus*; bound to the \`component/card/*\` token set, with \`shadow-card/*\` for the elevated variant).

## Overview

Card groups related content — settings panels, status summaries, and form shells — on the light-blue \`#EDF3FC\` card surface that distinguishes it from the page background. It composes an optional header (title + actions), a body, and a footer in a vertical 24px-gap stack, and is the standard shell for in-page forms and confirmations.

Card is a static layout surface. Do **not** use it for blocking flows that need a backdrop and focus trapping (use **Modal**), or for transient notifications (use **Toast**/**Message**). For a one-line status next to content, prefer a **Badge** inside the card's \`actions\` slot rather than a nested card.

## Anatomy

- **Container** — \`<div>\` surface (15px radius, 20px padding, 24px vertical gap, 1px border)
- **Header** (optional) — flex row with space-between: **title** (left) and **actions** (right)
- **Body** — main content area, secondary text color
- **Footer** (optional) — flex row for actions such as Cancel / Confirm Buttons
- **Shadow** (\`elevated\`) — soft \`shadow-card\` drop shadow, typically paired with \`borderless\`

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Background | \`--component-card-bg\` | \`--color-background-cards\` → \`--surface-cards\` \`#edf3fc\` |
| Border | \`--component-card-border\` | \`--color-border-default\` → \`--gray-200\` \`#c7c7c7\` |
| Radius | \`--component-card-radius\` | \`--radius-card\` → \`--radius-lg\` \`15px\` |
| Padding | \`--component-card-padding\` | \`--space-9\` \`20px\` |
| Section gap | \`--component-card-gap\` | \`--space-10\` \`24px\` |
| Title text | \`--component-card-title-text\` | \`--color-text-primary\` → \`--gray-700\` \`#364765\` |
| Body text | \`--component-card-body-text\` | \`--color-text-secondary\` → \`--gray-600\` \`#555766\` |
| Title type | \`--font-size-16\` + \`--font-weight-semibold\` | \`16px\` / \`600\` |
| Elevated shadow | \`--shadow-card-*\` | \`0 2px 9px 0 rgba(0, 0, 0, 0.1)\` |

## Accessibility

- Renders a generic \`<div>\` with no implicit role — it is a visual grouping, not a landmark; add \`role\`/\`aria-labelledby\` yourself if a region is semantically required.
- The title is a styled \`<div>\`, not a heading element, so it does not affect the page outline; pass your own \`<h2>\`/\`<h3>\` as \`title\` when document structure matters.
- The card itself is not focusable and has no keyboard behavior; interactive children (Buttons, Inputs) keep their own focus order and focus-visible styles.
- The body/title color pairs (gray-700 / gray-600 on \`#edf3fc\`) come from the semantic text tokens tuned for contrast on the card surface.

## Usage

- **Do** use \`elevated\` + \`borderless\` together for floating/raised cards (e.g. dialog-like form shells on the page surface).
- **Do** put the primary action last in the \`footer\` (Cancel then Confirm) and status pills in \`actions\`.
- **Do** keep titles short and descriptive — they label the whole card.
- **Don't** nest cards inside cards; restructure the content or use plain spacing instead.
- **Don't** make the entire card clickable while it also contains interactive children — wrap a single action instead.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Lepide AI',
    children: 'Connect your workspace to Lepide AI to start analysing activity across your environment.',
  },
  render: (args) => <div style={{ width: 380 }}><Card {...args} /></div>,
  parameters: {
    docs: {
      description: {
        story:
          'Baseline card: `component/card` surface `#edf3fc`, 1px gray-200 border, 15px radius, 20px padding, with title (gray-700) and body (gray-600) text tokens.',
      },
    },
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated card',
    elevated: true,
    borderless: true,
    children: 'This card is raised with the shadow-card tokens and has no border.',
  },
  render: (args) => <div style={{ width: 380 }}><Card {...args} /></div>,
  parameters: {
    docs: {
      description: {
        story:
          'The `elevated` + `borderless` combination: the 1px border is dropped and the `shadow-card` tokens (0 2px 9px rgba(0,0,0,0.1)) raise the surface.',
      },
    },
  },
};

export const WithActions: Story = {
  name: 'With Title Actions',
  args: {
    title: 'Connection status',
    actions: <Badge variant="success" dot>Active</Badge>,
    children: 'Your API credentials are valid and syncing every 5 minutes.',
  },
  render: (args) => <div style={{ width: 420 }}><Card {...args} /></div>,
  parameters: {
    docs: {
      description: {
        story:
          'The header `actions` slot holding a success Badge — the header row uses space-between so the title stays left and actions pin right.',
      },
    },
  },
};

export const WithFooter: Story = {
  name: 'With Footer Actions',
  args: {
    title: 'Delete workspace',
    children: 'This permanently removes the workspace and all associated credentials. This cannot be undone.',
    footer: (
      <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
    ),
  },
  render: (args) => <div style={{ width: 460 }}><Card {...args} /></div>,
  parameters: {
    docs: {
      description: {
        story:
          'Destructive confirmation pattern: the `footer` slot carries a secondary Cancel and a danger Delete Button, separated from the body by the 24px card gap.',
      },
    },
  },
};

/* ──────────────────────────────────────
   COMPOSITION — Card as the "Add Credentials" form shell
   ────────────────────────────────────── */

export const CredentialsCard: Story = {
  name: '✦ Add Credentials (composed)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Full composition matching the Figma "Add Credentials" screen: an elevated borderless Card as the form shell, stacked Inputs in the body, and Cancel/Done Buttons centered in the footer.',
      },
    },
  },
  render: () => (
    <Card
      elevated
      borderless
      title="Add Credentials for Lepide AI"
      style={{ width: 520 }}
      footer={
        <div style={{ display: 'flex', gap: 12, margin: '0 auto' }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Done</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Component Name" labelWidth={150} fullWidth />
        <Input label="API End Point URL" labelWidth={150} fullWidth />
        <Input label="API Key" labelWidth={150} fullWidth />
      </div>
    </Card>
  ),
};
