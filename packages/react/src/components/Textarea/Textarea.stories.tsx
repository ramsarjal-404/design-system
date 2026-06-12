import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Multi-line "Type Field Box" matching the Figma component (node 4:234).

## Overview

\`Textarea\` is the multi-line free-text entry of the Lepidus design system: a 481px, 15px-radius card-style box with 20px padding that swaps to a brand border and brand text while typing. Use it for descriptions, comments, notes — any content expected to span several lines.

For single-line values, do **not** use \`Textarea\`: prefer \`Input\` (labeled form field, 25px radius, helper/error messaging) inside forms, or the standalone \`TextField\` (label-less 44px pill, Figma node 45:504) for quick entry like search.

## Anatomy

- **Box wrapper** — 15px-radius card shell carrying the surface fill, 1px light-blue border, and 20px padding; owns the typing/disabled styling via \`:focus-within\`.
- **Textarea element** — transparent native \`<textarea>\`, 16/22 Open Sans regular, vertically resizable (resize disabled when the field is disabled).
- **Placeholder** — \`"Type Description here"\` by default, in the disabled-gray text token.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Background | \`--component-textarea-bg\` | \`--color-background-surface\` → \`#FFFFFF\` |
| Border | \`--component-textarea-border\` | \`--color-brand-light\` → \`#E4EDFF\` |
| Text | \`--component-textarea-text\` | \`--color-text-primary\` → \`#364765\` |
| Placeholder | \`--component-textarea-placeholder\` | \`--color-text-disabled\` → \`#727171\` |
| Typing background | \`--component-textarea-active-bg\` | \`--color-background-surface\` → \`#FFFFFF\` |
| Typing text | \`--component-textarea-active-text\` | \`--color-text-brand\` → \`#1C4599\` |
| Typing border | \`--component-textarea-active-border\` | \`--color-border-brand\` → \`#1C4599\` |
| Disabled background | \`--component-textarea-disabled-bg\` | \`--color-background-subtle\` → \`#F6F6F6\` |
| Disabled text | \`--component-textarea-disabled-text\` | \`--color-text-disabled\` → \`#727171\` |
| Disabled border | \`--component-textarea-disabled-border\` | \`--color-brand-light\` → \`#E4EDFF\` |
| Radius | \`--radius-card\` | \`--radius-lg\` → \`15px\` |
| Padding | \`--space-9\` | \`20px\` |
| Type | \`--typography-body-lg-fontSize\` / \`-lineHeight\` | \`16px\` / \`22px\` |

## States

- **Default** — white fill, light-blue \`#E4EDFF\` border (Figma resting variant).
- **Typing** — \`:focus-within\` mirrors the Figma "Typing state" variant: fill stays white while the border and entered text turn brand blue \`#1C4599\`.
- **Disabled** — subtle gray \`#F6F6F6\` fill, \`#727171\` text, \`not-allowed\` cursor, and vertical resize disabled (Figma "disabled" variant).

## Accessibility

- Renders a native \`<textarea>\`; all standard textarea attributes (\`name\`, \`maxLength\`, \`aria-*\`, etc.) pass through.
- No built-in label — supply \`aria-label\` or pair with an external \`<label>\`/\`aria-labelledby\`; the placeholder is not an accessible name.
- The typing state is conveyed by the brand border + text color change on \`:focus-within\`; standard Tab / Shift+Tab keyboard behavior applies (Tab moves focus rather than inserting a tab character).
- Disabled fields use the native \`disabled\` attribute and are removed from the tab order.

## Usage

- **Do** use \`rows\` (default 6) to size the box to the expected content length.
- **Do** pair the box with a visible external label or an \`aria-label\` describing the expected content.
- **Do** use \`fullWidth\` in form layouts so the box aligns to the container grid instead of the fixed 481px Figma width.
- **Don't** use \`Textarea\` for single-line values — use \`Input\` or \`TextField\`.
- **Don't** disable vertical resize via custom CSS; users rely on it for longer content.
`;

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Native placeholder text, styled with the component/textarea/placeholder token.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Type Description here'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — uses the component/textarea/disabled-* tokens and removes the field from the tab order.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to fill the container width (default fixed 481px from Figma).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    rows: {
      control: 'number',
      description: 'Native rows attribute controlling the initial visible line count.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    className: {
      control: false,
      description: 'Class applied to the outer box wrapper.',
      table: { type: { summary: 'string' } },
    },
    textareaClassName: {
      control: false,
      description: 'Class applied to the inner <textarea> element.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (native textarea attribute).',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=4-234',
    },
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Type Description here' },
  parameters: {
    docs: {
      description: {
        story:
          'Resting state — white fill with the light-blue brand border and the default "Type Description here" placeholder.',
      },
    },
  },
};

export const Typing: Story = {
  name: 'Typing (focus to see brand border)',
  args: { defaultValue: 'Type Description here' },
  parameters: {
    docs: {
      description: {
        story:
          'Click into the box to trigger the Figma "Typing state" variant: border and text swap to brand blue via :focus-within.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'Type Description here', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — subtle gray fill, gray text, resize disabled, removed from the tab order via the native disabled attribute.',
      },
    },
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'fullWidth overrides the fixed 481px Figma width so the box tracks its container — use this inside form layouts.',
      },
    },
  },
  args: { placeholder: 'Type Description here', fullWidth: true },
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Overview of the three Figma variants — default, typing (autofocused), and disabled — for quick visual QA.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Textarea placeholder="Type Description here" />
      <Textarea defaultValue="Type Description here" autoFocus />
      <Textarea defaultValue="Type Description here" disabled />
    </div>
  ),
};
