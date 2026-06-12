import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { TextField } from './TextField';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Standalone pill text field matching the Figma "Type Text Field" component (node 45:504).

## Overview

\`TextField\` is the label-less, standalone single-line entry of the Lepidus design system: a fixed-width (490px, 41px tall) pill with a 44px radius whose fill, text, and border swap on focus. Use it for inline quick entry — search bars, filter inputs, toolbar fields — where a separate label, helper text, or validation messaging is not needed.

Do **not** use it inside forms that need labels or error states — use \`Input\` (labeled form field, 25px radius, helper/error messaging) instead. For multi-line content prefer \`Textarea\` (15px-radius box, Figma node 4:234).

## Anatomy

- **Pill wrapper** — 44px-radius shell carrying the surface fill, 1px border, and 14px padding; owns the active/disabled styling via \`:focus-within\`.
- **Input element** — transparent native \`<input>\`, 16/22 Open Sans regular, primary text color.
- **Placeholder** — \`"Type text"\` by default, in the disabled-gray text token.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Background | \`--component-textfield-bg\` | \`--color-background-surface\` → \`#FFFFFF\` |
| Border | \`--component-textfield-border\` | \`--color-border-default\` → \`#C7C7C7\` |
| Text | \`--component-textfield-text\` | \`--color-text-primary\` → \`#364765\` |
| Placeholder | \`--component-textfield-placeholder\` | \`--color-text-disabled\` → \`#727171\` |
| Active background | \`--component-textfield-active-bg\` | \`--color-button-secondary-bg\` → \`#C6D8FF\` |
| Active text | \`--component-textfield-active-text\` | \`--color-text-brand\` → \`#1C4599\` |
| Active border | \`--component-textfield-active-border\` | \`--color-border-brand\` → \`#1C4599\` |
| Disabled background | \`--component-textfield-disabled-bg\` | \`--color-button-disabled-bg\` → \`#C6C6C6\` |
| Disabled text | \`--component-textfield-disabled-text\` | \`--color-text-disabled\` → \`#727171\` |
| Radius | \`--radius-xxl\` | \`44px\` |
| Padding | \`--space-18\` | \`14px\` |
| Type | \`--typography-body-lg-fontSize\` / \`-lineHeight\` | \`16px\` / \`22px\` |

## States

- **Normal** — white fill, \`#C7C7C7\` border (Figma "normal" variant).
- **Active** — \`:focus-within\` mirrors the Figma "active state" variant: light-blue \`#C6D8FF\` fill, brand \`#1C4599\` border, and the entered text turns brand blue.
- **Disabled** — gray \`#C6C6C6\` fill, light-blue border, \`#727171\` text, \`not-allowed\` cursor (Figma "disabled" variant).

## Accessibility

- Renders a native \`<input>\`; all standard input attributes (\`type\`, \`name\`, \`aria-*\`) pass through.
- No built-in label — supply \`aria-label\` or pair with an external \`<label>\`/\`aria-labelledby\` since the placeholder alone is not an accessible name.
- The active state is conveyed by the strong fill + border + text color change on \`:focus-within\`; standard Tab / Shift+Tab keyboard behavior applies.
- Disabled fields use the native \`disabled\` attribute and are removed from the tab order.

## Usage

- **Do** provide an \`aria-label\` (e.g. "Search") on every TextField since it has no visible label.
- **Do** use \`fullWidth\` when the field should track its container instead of the fixed 490px Figma width.
- **Don't** use TextField for form fields that need validation — \`Input\` provides error status and messaging.
- **Don't** stack multiple TextFields as a form; the missing labels hurt scannability and accessibility.
`;

const meta: Meta<typeof TextField> = {
  title: 'Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Native placeholder text, styled with the component/textfield/placeholder token.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Type text'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — uses the component/textfield/disabled-* tokens and removes the field from the tab order.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to fill the container width (default fixed 490px max from Figma).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: {
      control: false,
      description: 'Class applied to the outer pill wrapper.',
      table: { type: { summary: 'string' } },
    },
    inputClassName: {
      control: false,
      description: 'Class applied to the inner <input> element.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (native input attribute).',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=45-504',
    },
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Normal: Story = {
  args: { placeholder: 'Type text' },
  parameters: {
    docs: {
      description: {
        story:
          'Resting state matching the Figma "normal" variant — white fill, gray border, 44px pill, placeholder in the disabled-gray token.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    // Starts empty, showing the placeholder.
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('placeholder', 'Type text');

    // Clicking into the field focuses the native input (drives :focus-within).
    await userEvent.click(input);
    await waitFor(() => expect(input).toHaveFocus());

    // Typing updates the value.
    await userEvent.type(input, 'Hello Lepidus');
    await waitFor(() => expect(input).toHaveValue('Hello Lepidus'));
    expect(input).toHaveFocus();
  },
};

export const Filled: Story = {
  name: 'Active (focus to see fill)',
  args: { defaultValue: 'Type text' },
  parameters: {
    docs: {
      description: {
        story:
          'Click into the field to trigger the Figma "active state" variant: light-blue fill, brand border, and brand-blue text via :focus-within.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'Type text', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — gray fill and text from the component/textfield/disabled-* tokens, removed from the tab order.',
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
          'fullWidth overrides the fixed 490px Figma width so the pill tracks its container — useful in toolbars and page headers.',
      },
    },
  },
  args: { placeholder: 'Type text', fullWidth: true },
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Overview of the three Figma variants — normal, active (autofocused), and disabled — for quick visual QA.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
      <TextField placeholder="Type text" />
      <TextField defaultValue="Type text" autoFocus />
      <TextField defaultValue="Type text" disabled />
    </div>
  ),
};
