import type { Meta, StoryObj } from '@storybook/react';
import { Scrollbar } from './Scrollbar';

const meta: Meta<typeof Scrollbar> = {
  title: 'Data Display/Scrollbar',
  component: Scrollbar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'active', 'disabled'],
      description:
        'Thumb state — `default` (neutral resting), `active` (engaged/dragging, brand blue-200) or `disabled` (non-interactive gray).',
      table: {
        type: { summary: "'default' | 'active' | 'disabled'" },
        defaultValue: { summary: "'active'" },
      },
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Track direction; also sets `aria-orientation`.',
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    thumbSize: {
      control: { type: 'range', min: 5, max: 100, step: 1 },
      description: 'Thumb length as a percentage of the track (0–100). 26 ≈ the Figma 117/451 ratio.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '26' } },
    },
    thumbOffset: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Thumb offset from the track start as a percentage (0–100). Exposed as `aria-valuenow`.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    length: {
      control: 'text',
      description: 'Track length along its axis — a number (px) or any CSS length string.',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: "'451px'" } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=326-16',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Presentational scrollbar track + thumb — a fully-rounded pill bound to Figma node **326:16 "scroll bar"**.

## Overview

\`Scrollbar\` renders the Lepidus scrollbar visuals: a 10px pill track holding a state-colored thumb whose size and position are driven by props. Use it to skin custom scroll containers, virtualized lists or progress-along-content indicators so they match the design language.

It is **purely presentational** — it does not listen to wheel/drag events or scroll anything itself; the host component owns the scroll math and feeds \`thumbSize\` / \`thumbOffset\`. For native overflow scrolling where custom visuals are not required, just use the browser scrollbar.

## Anatomy

- **Track** — fully-rounded pill (\`radius/xxl\`), 10px thick (\`space/5\`), in the subtle background tint; length set by \`length\`.
- **Thumb** — fully-rounded bar riding over the track; its color reflects \`variant\`, its length \`thumbSize\` (%) and its position \`thumbOffset\` (%).

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Track color | \`--component-scrollbar-track\` | #F6F6F6 |
| Track thickness | \`--space-5\` | 10px |
| Track / thumb radius | \`--radius-xxl\` | 44px (full pill) |
| Thumb (default) | \`--component-scrollbar-thumb\` | #C7C7C7 |
| Thumb (active) | \`--color-button-secondary-bg\` | #C6D8FF (blue-200) |
| Thumb (disabled) | \`--color-button-disabled-bg\` | #C6C6C6 |

## States & variants

- \`variant="default"\` — neutral resting thumb (\`component/scrollbar/thumb\`).
- \`variant="active"\` *(default — the Figma default property)* — engaged/dragging thumb in \`color/button/secondary/bg\` (brand blue-200).
- \`variant="disabled"\` — non-interactive thumb in \`color/button/disabled/bg\`; also sets \`aria-disabled\`.
- \`orientation="vertical" | "horizontal"\` — same tokens, axis flipped.
- Geometry — \`thumbSize\`, \`thumbOffset\` and \`length\` are forwarded as CSS custom properties (\`--thumb-size\`, \`--thumb-offset\`, \`--track-length\`).

## Accessibility

- The root renders \`role="scrollbar"\` with \`aria-orientation\` matching the \`orientation\` prop.
- Position is exposed via \`aria-valuenow\` (rounded \`thumbOffset\`) with \`aria-valuemin=0\` / \`aria-valuemax=100\`.
- \`aria-disabled\` is set when \`variant="disabled"\`.
- The ARIA pattern also expects \`aria-controls\` referencing the scrolled element and keyboard support (arrows/PageUp/PageDown) — the host integration must supply both, since this component is presentation-only.

## Usage

- **Do** keep the thumb proportional: \`thumbSize\` ≈ (viewport ÷ content) × 100, clamped to a usable minimum.
- **Do** pair \`variant="active"\` with the actual drag/scroll interaction state in your container.
- **Don't** ship it as the only scrolling affordance without wiring keyboard and pointer handling in the host.
- **Don't** restyle the thumb with ad-hoc colors — the three variants cover the sanctioned states.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Scrollbar>;

/** The Figma default — active thumb (brand secondary), ~26% length. */
export const Active: Story = {
  args: { variant: 'active', thumbSize: 26, thumbOffset: 0 },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma default property: engaged thumb in `color/button/secondary/bg` (blue-200) at the ~26% Figma ratio.',
      },
    },
  },
};

export const Default: Story = {
  args: { variant: 'default', thumbSize: 26, thumbOffset: 18 },
  parameters: {
    docs: {
      description: {
        story: 'Neutral resting state — the thumb uses `component/scrollbar/thumb` (#C7C7C7).',
      },
    },
  },
};

export const Disabled: Story = {
  args: { variant: 'disabled', thumbSize: 26, thumbOffset: 18 },
  parameters: {
    docs: {
      description: {
        story: 'Non-interactive state — gray `color/button/disabled/bg` thumb plus `aria-disabled` on the root.',
      },
    },
  },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', variant: 'active', thumbSize: 30, thumbOffset: 10, length: 360 },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal orientation — identical tokens with the axis flipped and `aria-orientation="horizontal"`.',
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
        story: 'The three thumb states plus the horizontal orientation, side by side for comparison.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
      <Col title="Default"><Scrollbar variant="default" length={300} thumbOffset={20} /></Col>
      <Col title="Active"><Scrollbar variant="active" length={300} thumbOffset={0} /></Col>
      <Col title="Disabled"><Scrollbar variant="disabled" length={300} thumbOffset={20} /></Col>
      <Col title="Horizontal">
        <Scrollbar orientation="horizontal" variant="active" length={260} thumbSize={32} thumbOffset={12} />
      </Col>
    </div>
  ),
};

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </span>
      {children}
    </div>
  );
}
