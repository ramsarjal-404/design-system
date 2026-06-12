import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'white'],
      description:
        'Visual variant — maps 1:1 to the Figma `component/button/{variant}/*` token set.',
      table: {
        type: { summary: "'primary' | 'secondary' | 'danger' | 'white'" },
        defaultValue: { summary: "'primary'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Size preset. `sm` = compact (5/16 padding, 29px min-height) for dense UI like table rows; `md` = regular (12/20 padding); `lg` = with-icon (10/24 padding, 24px left icon). `md`/`lg` resolve to a 41px min-height.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Native disabled state — swaps fill/text to the `component/button/disabled/*` tokens and blocks pointer interaction.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconLeft: {
      control: false,
      description:
        'Leading icon slot. Pass an SVG that uses `currentColor`; it renders at 16px (`md`) or 24px (`lg`).',
      table: { type: { summary: 'ReactNode' } },
    },
    iconRight: {
      control: false,
      description:
        'Trailing icon slot. Pass an SVG that uses `currentColor`; it renders at 16px.',
      table: { type: { summary: 'ReactNode' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch the button to fill its container width.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button label (required).',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root `<button>`.',
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

Pill-shaped action button of the Lepidus design system (Figma file *Lepidus*; tokens generated from the \`component/button/*\` DTCG set).

## Overview

Button is the primary interactive control for triggering actions — submitting forms, confirming dialogs, and starting flows. Use \`primary\` for the single most important action on a screen, \`secondary\` for supporting actions, \`danger\` for destructive operations, and \`white\` on dark or brand-colored surfaces. Every visual property is driven by the three-tier token chain **component → semantic → primitive**, so themes (\`data-theme="dark"\` / \`"hc"\`) restyle it automatically.

Do **not** use Button for navigation styled as a link (use an anchor), for compact icon-only actions inside rows or toolbars (use **ActionItem**), or for status display (use **Badge**).

## Anatomy

- **Container** — pill-shaped \`<button>\` (50px radius, 1px border, 41px min-height)
- **Label** — required text, Open Sans 14px Bold
- **Icon left** (optional) — 16px slot in \`md\`, 24px in \`lg\`
- **Icon right** (optional) — 16px slot
- **Focus ring** — 3px brand-tinted box-shadow on \`:focus-visible\`

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Primary fill | \`--component-button-primary-fill\` | \`--color-button-primary-bg\` → \`--blue-600\` \`#1c4599\` |
| Primary hover fill | \`--component-button-primary-hover-fill\` | \`--color-button-primary-hover\` → \`--blue-700\` \`#183a81\` |
| Primary text | \`--component-button-primary-text\` | \`--color-button-primary-text\` → \`--white\` \`#ffffff\` |
| Secondary fill | \`--component-button-secondary-fill\` | \`--color-button-secondary-bg\` → \`--blue-200\` \`#c6d8ff\` |
| Secondary text / stroke | \`--component-button-secondary-text\` / \`-stroke\` | \`--blue-600\` \`#1c4599\` |
| Danger fill | \`--component-button-danger-fill\` | \`--color-button-danger-bg\` → \`--red-200\` \`#ff9696\` |
| Danger text / stroke | \`--component-button-danger-text\` / \`-stroke\` | \`--red-400\` \`#f72b2b\` |
| White fill | \`--component-button-white-fill\` | \`--color-background-surface\` → \`--white\` \`#ffffff\` |
| Disabled fill / text | \`--component-button-disabled-fill\` / \`-text\` | \`--gray-400\` \`#c6c6c6\` / \`--gray-500\` \`#727171\` |
| Radius | \`--component-button-radius\` | \`--radius-button\` → \`--radius-full\` \`50px\` |
| Font size / weight | \`--component-button-fontSize\` + \`--font-weight-bold\` | \`--font-size-14\` \`14px\` / \`700\` |
| Icon gap | \`--component-button-gap\` | \`--space-5\` \`10px\` |

## Accessibility

- Renders a native \`<button>\` — implicit \`role="button"\`, works in forms, and supports all \`ButtonHTMLAttributes\` (\`type\`, \`aria-*\`, etc.).
- Keyboard: focusable with **Tab**, activated with **Enter** / **Space** (native behavior).
- \`:focus-visible\` shows a 3px brand-tinted ring (\`rgba(28, 69, 153, 0.35)\`); no ring on mouse click.
- \`disabled\` uses the native attribute, so the control is removed from the tab order and announced as dimmed; \`cursor: not-allowed\` reinforces it visually.
- Icon slots are presentational — the accessible name always comes from the text label, so never render an icon-only Button.

## Usage

- **Do** use one \`primary\` button per view; pair it with \`secondary\` for the alternative action (e.g. Done / Cancel).
- **Do** write concise, verb-first labels ("Save changes", not "Click here to save").
- **Do** use \`danger\` for destructive confirmations (Delete, Remove) — typically inside a Card footer or Modal.
- **Don't** use \`white\` on light backgrounds; it is designed for dark/brand surfaces.
- **Don't** rely on icons alone to convey meaning — the label is the accessible name.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ──────────────────────────────────────
   PRIMARY VARIANT
   ────────────────────────────────────── */

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button Primary' },
  parameters: {
    docs: {
      description: {
        story:
          'Default resting state of the primary variant: `component/button/primary` fill `#1c4599` (blue-600) with white bold 14px text and the 50px pill radius.',
      },
    },
  },
};

export const PrimaryHover: Story = {
  name: 'Primary — Hover',
  args: { variant: 'primary', children: 'Button Primary' },
  parameters: {
    pseudo: { hover: true },
    docs: {
      description: {
        story:
          'Forced hover state (storybook-addon-pseudo-states): fill shifts to `--component-button-primary-hover-fill` → blue-700 `#183a81` with a 180ms ease transition.',
      },
    },
  },
};

export const PrimaryDisabled: Story = {
  name: 'Primary — Disabled',
  args: { variant: 'primary', children: 'Button Primary', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Native `disabled` state: all variants collapse to the shared `component/button/disabled` tokens — gray-400 fill, gray-500 text, `cursor: not-allowed`.',
      },
    },
  },
};

export const PrimaryWithIcons: Story = {
  name: 'Primary — With Icons (lg)',
  args: {
    variant: 'primary',
    size: 'lg',
    iconLeft: <EditIcon />,
    iconRight: <ChevronIcon />,
    children: 'Button Primary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `lg` (with-icon) size: 10/24 padding, a 24px left icon and 16px right icon, separated from the label by `--component-button-gap` (10px).',
      },
    },
  },
};

/* ──────────────────────────────────────
   SECONDARY VARIANT
   ────────────────────────────────────── */

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Button Secondary' },
  parameters: {
    docs: {
      description: {
        story:
          'Secondary (supporting) variant: light blue-200 `#c6d8ff` fill with brand blue-600 text and stroke from `component/button/secondary/*`.',
      },
    },
  },
};

export const SecondaryHover: Story = {
  name: 'Secondary — Hover',
  args: { variant: 'secondary', children: 'Button Secondary' },
  parameters: {
    pseudo: { hover: true },
    docs: {
      description: {
        story:
          'Forced hover state: secondary inverts to the primary fill tokens (blue-600 background, white text), signalling the same action family.',
      },
    },
  },
};

export const SecondaryDisabled: Story = {
  name: 'Secondary — Disabled',
  args: { variant: 'secondary', children: 'Button Secondary', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled secondary — identical to every other disabled variant because the `component/button/disabled` tokens override the variant colors.',
      },
    },
  },
};

export const SecondaryWithIcons: Story = {
  name: 'Secondary — With Icons (lg)',
  args: {
    variant: 'secondary',
    size: 'lg',
    iconLeft: <EditIcon />,
    iconRight: <ChevronIcon />,
    children: 'Button Secondary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Secondary in the `lg` with-icon size — icons inherit the brand text color via `currentColor` and flip to white on hover.',
      },
    },
  },
};

/* ──────────────────────────────────────
   DANGER VARIANT
   ────────────────────────────────────── */

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
  parameters: {
    docs: {
      description: {
        story:
          'Destructive variant: red-200 `#ff9696` fill with red-400 text/stroke from `component/button/danger/*`; hover deepens to solid red-400 with white text.',
      },
    },
  },
};

export const DangerDisabled: Story = {
  name: 'Danger — Disabled',
  args: { variant: 'danger', children: 'Delete', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled danger button — the destructive coloring is intentionally dropped in favor of the neutral disabled tokens so it cannot read as actionable.',
      },
    },
  },
};

export const DangerWithIcons: Story = {
  name: 'Danger — With Icons (lg)',
  args: {
    variant: 'danger',
    size: 'lg',
    iconLeft: <EditIcon />,
    iconRight: <ChevronIcon />,
    children: 'Delete',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Danger in the `lg` with-icon size — icon slots inherit the red-400 danger text color through `currentColor`.',
      },
    },
  },
};

/* ──────────────────────────────────────
   WHITE VARIANT
   ────────────────────────────────────── */

/* The white variant is documented for dark/brand surfaces, so these stories wrap it
   in an explicit dark container instead of swapping the Storybook canvas background —
   the canvas swap repaints asynchronously and bled into the axe audit of the next story. */
const darkSurface: Decorator = (Story) => (
  <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '8px', background: '#1A202C' }}>
    <Story />
  </div>
);

export const White: Story = {
  args: { variant: 'white', children: 'Button White' },
  decorators: [darkSurface],
  parameters: {
    docs: {
      description: {
        story:
          'White variant for dark or brand surfaces: `color/background/surface` fill with brand blue-600 text and stroke. Shown on a dark surface.',
      },
    },
  },
};

export const WhiteDisabled: Story = {
  name: 'White — Disabled',
  args: { variant: 'white', children: 'Button White', disabled: true },
  decorators: [darkSurface],
  parameters: {
    docs: {
      description: {
        story:
          'Disabled white variant on a dark surface — collapses to the shared gray disabled tokens like every other variant.',
      },
    },
  },
};

/* ──────────────────────────────────────
   KITCHEN SINK — All variants side by side
   ────────────────────────────────────── */

export const AllVariants: Story = {
  name: '✦ All Variants',
  parameters: {
    docs: {
      description: {
        story:
          'Full matrix of variants × states: normal, disabled, `lg` with icons, and `fullWidth` — useful for visual regression and for comparing the four `component/button/*` token sets at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
      {/* Row: Normal */}
      <div>
        <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Normal State
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          {/* white is for dark/brand surfaces — shown on its documented brand background */}
          <span style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', background: 'var(--color-brand-primary)' }}>
            <Button variant="white">White</Button>
          </span>
        </div>
      </div>

      {/* Row: Disabled */}
      <div>
        <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Disabled State
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="danger" disabled>Danger</Button>
          {/* white is for dark/brand surfaces — shown on its documented brand background */}
          <span style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', background: 'var(--color-brand-primary)' }}>
            <Button variant="white" disabled>White</Button>
          </span>
        </div>
      </div>

      {/* Row: With Icons (lg) */}
      <div>
        <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          With Icons (Large)
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" iconLeft={<EditIcon />} iconRight={<ChevronIcon />}>Primary</Button>
          <Button variant="secondary" size="lg" iconLeft={<EditIcon />} iconRight={<ChevronIcon />}>Secondary</Button>
          <Button variant="danger" size="lg" iconLeft={<EditIcon />} iconRight={<ChevronIcon />}>Danger</Button>
          {/* white is for dark/brand surfaces — shown on its documented brand background */}
          <span style={{ display: 'inline-flex', padding: '8px', borderRadius: '8px', background: 'var(--color-brand-primary)' }}>
            <Button variant="white" size="lg" iconLeft={<EditIcon />} iconRight={<ChevronIcon />}>White</Button>
          </span>
        </div>
      </div>

      {/* Row: Full Width */}
      <div>
        <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Full Width
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <Button variant="primary" fullWidth>Primary Full Width</Button>
          <Button variant="secondary" fullWidth>Secondary Full Width</Button>
        </div>
      </div>
    </div>
  ),
};
