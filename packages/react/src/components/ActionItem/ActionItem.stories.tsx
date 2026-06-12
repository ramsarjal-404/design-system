import type { Meta, StoryObj } from '@storybook/react';
import { ActionItem, defaultActions } from './ActionItem';
import { DeleteIcon, UploadIcon, EditIcon, ShareIcon } from './actionIcons';

const meta: Meta<typeof ActionItem> = {
  title: 'Actions/ActionItem',
  component: ActionItem,
  tags: ['autodocs'],
  argTypes: {
    actions: {
      control: false,
      description:
        'Ordered list of icon actions (`{ id, label, icon, tone?, onClick?, disabled? }`). Defaults to the Figma set: delete (danger) · upload · edit · share.',
      table: {
        type: { summary: 'ActionItemAction[]' },
        defaultValue: { summary: 'defaultActions (delete · upload · edit · share)' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label announced for the toolbar group.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Item actions'" },
      },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the toolbar root.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=813-4213',
    },
    docs: {
      description: {
        component: `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Floating icon-action toolbar of the Lepidus design system (Figma node **813:4213 "Action Item"**).

## Overview

ActionItem is a compact white toolbar that floats over or beside a row, card, or canvas item and exposes its quick actions as 24px icon buttons — by default the Figma set of delete (danger tone), upload, edit, and share. Use it for contextual per-item operations in tables, file lists, and previews where labelled Buttons would be too heavy.

Do **not** use it for a page's primary actions (use **Button** — actions here are icon-only) or for status display (use **Badge**). Each glyph has exactly two tones: \`brand\` (default) and \`danger\` for destructive actions.

## Anatomy

- **Surface** — white \`role="toolbar"\` container, 6px radius, \`shadow/low\` elevation, 3px/4px padding
- **Icon buttons** — one native \`<button>\` per action, 24px glyph in a rounded hit target, 30px apart
- **Tone** — \`brand\` glyphs in blue-600; \`danger\` glyphs in red-400
- **Hover fill** — brand secondary (light blue) for brand actions; light error red for danger actions
- **Tooltip** — native \`title\` from each action's \`label\`

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Surface | \`--color-background-surface\` | \`--white\` \`#ffffff\` |
| Gap between actions | \`--space-11\` | \`30px\` |
| Padding (Y / X) | \`--space-17\` / \`--space-2\` | \`3px\` / \`4px\` |
| Radius | \`--radius-s\` | \`6px\` |
| Elevation | \`--shadow-low-*\` | \`0 4px 4px 0 rgba(0, 0, 0, 0.25)\` |
| Brand glyph | \`--color-text-brand\` | \`--blue-600\` \`#1c4599\` |
| Danger glyph | \`--color-text-danger\` | \`--red-400\` \`#f72b2b\` |
| Brand hover fill | \`--color-brand-secondary\` | \`--blue-200\` \`#c6d8ff\` |
| Danger hover fill | \`--color-status-error-bg\` | \`--red-100\` \`#ffebee\` |
| Focus ring | \`--color-border-brand\` | \`--blue-600\` \`#1c4599\` |

## Accessibility

- Root is \`role="toolbar"\` with a configurable \`aria-label\` (default \`"Item actions"\`) so the group is announced as a named toolbar.
- Each action is a native \`<button type="button">\` with \`aria-label\` and a matching \`title\` tooltip — the 24px glyphs are purely visual.
- Keyboard: every button is in the tab order and activates with **Enter** / **Space** (native semantics; no roving-tabindex arrow-key pattern).
- \`:focus-visible\` draws a 2px brand-colored outline with a 2px offset around the focused action.
- Disabled actions use the native \`disabled\` attribute (removed from tab order) and dim to 40% opacity.

## Usage

- **Do** give every action a clear, verb-first \`label\` — it is the accessible name and the tooltip.
- **Do** reserve \`tone: 'danger'\` for destructive operations (delete, remove) and keep it first or last, not mixed mid-row.
- **Do** pass custom subsets via \`actions\` when an item supports fewer operations.
- **Don't** exceed roughly five actions — overflow into a menu instead.
- **Don't** use ActionItem for navigation or primary CTAs; it is for contextual item-level operations.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionItem>;

/** Exact Figma set: delete (danger) · upload · edit · share. */
export const Default: Story = {
  args: { actions: defaultActions },
  parameters: {
    docs: {
      description: {
        story:
          'The exact Figma 813:4213 set — delete (danger tone, red-400) followed by upload, edit, and share in the brand blue-600 tone, on the white `shadow/low` surface.',
      },
    },
  },
};

/** Wired up with click handlers (check the Actions panel). */
export const Interactive: Story = {
  args: {
    actions: [
      { id: 'delete', label: 'Delete', icon: <DeleteIcon />, tone: 'danger', onClick: () => alert('Delete') },
      { id: 'upload', label: 'Upload', icon: <UploadIcon />, onClick: () => alert('Upload') },
      { id: 'edit', label: 'Edit', icon: <EditIcon />, onClick: () => alert('Edit') },
      { id: 'share', label: 'Share', icon: <ShareIcon />, onClick: () => alert('Share') },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each action wired to an `onClick` handler — click to trigger; hover shows the brand-secondary fill (blue-200) and the danger action the light error fill (red-100).',
      },
    },
  },
};

/** A disabled action dims to 40% and is non-interactive. */
export const WithDisabled: Story = {
  name: 'With Disabled Action',
  args: {
    actions: [
      { id: 'delete', label: 'Delete', icon: <DeleteIcon />, tone: 'danger', disabled: true },
      { id: 'upload', label: 'Upload', icon: <UploadIcon /> },
      { id: 'edit', label: 'Edit', icon: <EditIcon /> },
      { id: 'share', label: 'Share', icon: <ShareIcon /> },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Per-action `disabled` state: the delete button dims to 40% opacity, loses its hover fill, and is removed from the tab order via the native attribute.',
      },
    },
  },
};

/** Compose a custom subset — the component takes any ordered action list. */
export const CustomSubset: Story = {
  name: 'Custom Subset',
  args: {
    actions: [
      { id: 'edit', label: 'Edit', icon: <EditIcon /> },
      { id: 'share', label: 'Share', icon: <ShareIcon /> },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A reduced two-action toolbar — `actions` accepts any ordered list, and the surface shrinks to fit (`width: fit-content`) while keeping the 30px `space/11` gap.',
      },
    },
  },
};

export const Showcase: Story = {
  name: '✦ Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The toolbar in isolation and floating on the Lepide page surface (gray-50 `#F5F7FD`) — demonstrating how the white surface and `shadow/low` elevation separate it from the background.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Row title="Default (Figma set)">
        <ActionItem actions={defaultActions} />
      </Row>
      <Row title="On a Lepide page surface">
        <div style={{ background: '#F5F7FD', padding: 32, borderRadius: 8 }}>
          <ActionItem actions={defaultActions} />
        </div>
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
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}
