import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Spinner } from './Spinner';
import { Button } from '../Button';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Indeterminate loading indicator — a brand-blue arc rotating over a subtle track.

No dedicated Figma frame yet — built token-first; add the frame and node link when designed.

## Overview

\`Spinner\` signals an indeterminate wait with no known shape: submitting a form, refreshing a
table, a button working. It renders \`role="status"\` with a visually hidden label
("Loading…" by default), so screen readers announce the wait without any extra wiring. Three
sizes cover inline/button (sm 16), default (md 24) and page-region (lg 32) use.

If the incoming content's layout is known, prefer **Skeleton**; for measurable progress, use
**Progress**.

## Anatomy

- **Track** — full circle, \`--color-background-subtle\`, 3px stroke.
- **Arc** — ~28% of the circumference, \`--color-brand-primary\`, round caps, rotating.
- **Hidden label** — clip-rect visually hidden span inside the \`role="status"\` root.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Arc | \`--color-brand-primary\` | \`--blue-600\` → #1C4599 |
| Track | \`--color-background-subtle\` | \`--gray-100\` → #F6F6F6 |
| Rotation duration | \`--duration-slow\` × 4 | 240ms × 4 ≈ 1s/turn |
| Pulse opacity (reduced motion) | \`--opacity-disabled\` | 0.5 |
| sm size | \`--space-8\` | 16px |
| md size | \`--space-10\` | 24px |
| lg size | \`--space-8\` × 2 | 32px |

## States & variants

Sizes \`sm\` / \`md\` / \`lg\`. Under \`prefers-reduced-motion\` the rotation stops and the arc
pulses opacity slowly instead — the indicator never goes fully static while loading.

## Accessibility

- Root is \`role="status"\` (an implicit polite live region) with a visually hidden \`label\` —
  screen readers announce it when it appears; the SVG is \`aria-hidden\`.
- Make the \`label\` specific when context helps: \`label="Saving changes…"\`.
- One announcement per region is enough — don't render many labelled spinners side by side.

## Usage

- **Do** use \`size="sm"\` inside buttons and inline with text; reserve \`lg\` for empty regions.
- **Do** keep the spinner visible until the action genuinely completes.
- **Don't** use Spinner when content shape is known — that's **Skeleton**.
- **Don't** stack a spinner on top of skeleton placeholders; pick one signal per region.
`;

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Diameter — sm (16px, inline/buttons), md (24px) or lg (32px, page regions).',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: "'md'" } },
    },
    label: {
      control: 'text',
      description: 'Accessible label announced via a visually hidden span inside the `role="status"` root.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Loading…'" } },
    },
    className: {
      control: false,
      description: 'Extra class on the root element.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // role="status" announces its CONTENT via the live region (the role's
    // name comes only from author attributes, so we assert the hidden text).
    const status = canvas.getByRole('status');
    expect(status).toHaveTextContent('Loading…');
    expect(status.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Spinner size="sm" label="Loading (small)" />
      <Spinner size="md" label="Loading (medium)" />
      <Spinner size="lg" label="Loading (large)" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The three diameters: sm 16px, md 24px, lg 32px.' } },
  },
};

export const InButton: Story = {
  name: 'In Button',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button variant="primary" disabled iconLeft={<Spinner size="sm" label="Saving" />}>
        Saving…
      </Button>
      <Button variant="secondary" disabled iconLeft={<Spinner size="sm" label="Scanning" />}>
        Scanning
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Composed with a disabled `Button` via its `iconLeft` slot — the canonical "working" affordance while a submit is in flight.',
      },
    },
  },
};

export const Inline: Story = {
  render: () => (
    <p
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        margin: 0,
        fontFamily: 'var(--font-family-primary)',
        fontSize: 14,
        color: 'var(--color-text-secondary)',
      }}
    >
      <Spinner size="sm" label="Refreshing results" />
      Refreshing results…
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline with body text using `size="sm"` — visible text mirrors the hidden label.',
      },
    },
  },
};
