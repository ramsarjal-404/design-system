import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Skeleton } from './Skeleton';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Loading placeholder mirroring the shape of incoming content.

No dedicated Figma frame yet — built token-first; add the frame and node link when designed.

## Overview

\`Skeleton\` holds the layout steady while data loads, replacing spinout layout shifts with
shape-matched gray blocks: \`text\` lines, a \`circle\` for avatars/icons, a \`rect\` for images
and cards. A subtle shimmer sweeps across each block; under \`prefers-reduced-motion\` it
degrades to a static fill. Compose several skeletons to sketch the real layout
(see **CardSkeleton**).

Use Skeleton when you know the shape of what's coming and it takes more than ~300ms. For an
indeterminate action with no known shape (submitting, refreshing), use **Spinner**; for
measurable progress, use **Progress**.

## Anatomy

- **Block** — base fill \`--color-background-subtle\` with a \`--color-background-surface\`
  shimmer highlight sweeping left→right.
- **Variants** — \`text\` (rounded 14px line), \`circle\` (40px default), \`rect\` (rounded box).
- **Paragraph** — \`variant="text"\` with \`lines > 1\` stacks lines, the last cut to 60%.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Base fill | \`--color-background-subtle\` | \`--gray-100\` → #F6F6F6 |
| Shimmer highlight | \`--color-background-surface\` | white |
| Sweep duration | \`--duration-slow\` × 8 | 240ms × 8 ≈ 1.9s |
| Sweep easing | \`--easing-standard\` | cubic-bezier(0.2, 0, 0, 1) |
| Text radius | \`--radius-xs\` | 4px |
| Rect radius | \`--radius-sm\` | 8px |
| Circle radius | \`--radius-circle\` | 9999px |
| Line gap | \`--space-4\` | 8px |

## States & variants

\`text\` / \`circle\` / \`rect\`, single or multi-line (\`lines\`), free-size via \`width\`/\`height\`
(numbers are px, strings pass through). Shimmer is replaced by a static fill under
\`prefers-reduced-motion\`.

## Accessibility

- Each skeleton is **decoration**: it renders \`aria-hidden="true"\` and exposes nothing to
  assistive tech.
- Communicate loading on the **container** instead: set \`aria-busy="true"\` while skeletons
  show, and clear it when content arrives. For long loads, announce status with a polite live
  region (or a \`Spinner\` with \`role="status"\`).

## Usage

- **Do** match skeleton shapes and sizes to the real content so nothing jumps on load.
- **Do** swap skeletons for content all at once per region — partial swaps look broken.
- **Don't** show skeletons for sub-300ms loads — the flash is worse than the wait.
- **Don't** use Skeleton for action feedback (saving, submitting) — that's **Spinner**.
`;

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['text', 'circle', 'rect'],
      description: 'Shape of the placeholder — text line, circle (avatar) or rect (image/card).',
      table: { type: { summary: "'text' | 'circle' | 'rect'" }, defaultValue: { summary: "'text'" } },
    },
    width: {
      control: 'text',
      description: 'Width — a number is treated as px, a string passes through (`100%`, `12rem`).',
      table: { type: { summary: 'number | string' } },
    },
    height: {
      control: 'text',
      description: 'Height — a number is treated as px, a string passes through. Circles default to `width`.',
      table: { type: { summary: 'number | string' } },
    },
    lines: {
      control: { type: 'number', min: 1 },
      description: 'For `variant="text"`: stacked line count; the last line is cut to 60% width.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    className: {
      control: false,
      description: 'Extra class on the root element.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: { variant: 'text', width: 280 },
  play: async ({ canvasElement }) => {
    // Skeletons are decoration — hidden from assistive tech.
    const skeleton = canvasElement.querySelector('[aria-hidden="true"]');
    expect(skeleton).not.toBeNull();
    expect(within(canvasElement).queryByRole('status')).toBeNull();
  },
};

export const Paragraph: Story = {
  args: { variant: 'text', lines: 3, width: 320 },
  parameters: {
    docs: {
      description: {
        story: 'Multi-line text block (`lines={3}`) — the last line is cut to 60% so it reads as a paragraph.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[aria-hidden="true"]');
    expect(root).not.toBeNull();
    expect(root!.children).toHaveLength(3);
  },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 40 },
  parameters: {
    docs: { description: { story: 'Avatar/icon placeholder — `height` defaults to `width`.' } },
  },
};

export const Rect: Story = {
  args: { variant: 'rect', width: 320, height: 160 },
  parameters: {
    docs: { description: { story: 'Image/card-media placeholder with `--radius-sm` corners.' } },
  },
};

export const CardSkeleton: Story = {
  name: 'CardSkeleton composition',
  render: () => (
    <div
      aria-busy="true"
      style={{
        width: 320,
        padding: 'var(--space-8)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-background-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" height={10} />
        </div>
      </div>
      <Skeleton variant="rect" height={140} />
      <Skeleton variant="text" lines={2} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Composition sketching a Card while it loads — avatar, title pair, media block, body lines. Note `aria-busy="true"` on the container: the skeletons themselves are `aria-hidden`.',
      },
    },
  },
};

export const AllVariants: Story = {
  name: '✦ All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="circle" width={40} />
      <Skeleton variant="rect" height={96} />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Text line, paragraph, circle and rect side by side for quick QA.' },
    },
  },
};
