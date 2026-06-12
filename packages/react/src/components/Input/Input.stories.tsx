import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Button } from '../Button';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Labeled single-line form field bound to the canonical Figma **component/input/** tokens (Figma "Add Credentials" form fields).

## Overview

\`Input\` is the labeled form-field primitive of the Lepidus design system: a 25px-radius pill field with an inline-left (Figma form default) or stacked-top label, optional helper/error text, and icon adornment slots. Use it inside forms and modals wherever a value needs a visible label and validation messaging.

Do **not** use it for label-less search or quick-entry fields — prefer the standalone \`TextField\` (44px pill, Figma node 45:504) for those. For multi-line content (descriptions, comments), prefer \`Textarea\` (15px-radius box, Figma node 4:234). For numeric values with increment/decrement controls, prefer \`Stepper\`.

## Anatomy

- **Wrapper** — vertical flex column holding the row and the message line.
- **Label** — semibold 14/19 text in text-secondary gray (\`#555766\`); fixed 171px column when inline-left.
- **Field shell** — 25px-radius pill carrying the background, 1px border, and 12/20 padding; owns focus/error/disabled styling via \`:focus-within\`.
- **Input element** — transparent native \`<input>\`, 14/19 Open Sans, text \`#364765\`, placeholder \`#727171\`.
- **Icon slots** — optional \`iconLeft\` / \`iconRight\` adornments (18×18 svg).
- **Message** — 12/16 helper text below the field; turns danger red and swaps to \`errorMessage\` when \`status="error"\`.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Field background | \`--component-input-bg\` | \`--color-background-surface\` → \`#FFFFFF\` |
| Field border | \`--component-input-border\` | \`--color-input-border\` → \`#C7C7C7\` |
| Corner radius | \`--component-input-radius\` | \`--radius-input\` → \`25px\` |
| Text color | \`--component-input-text\` | \`--color-text-primary\` → \`#364765\` |
| Label color | \`--component-input-label\` | \`--color-text-secondary\` → \`#555766\` |
| Placeholder | \`--component-input-placeholder\` | \`--color-text-disabled\` → \`#727171\` |
| Padding | \`--component-input-paddingY\` / \`--component-input-paddingX\` | \`12px\` / \`20px\` |
| Type | \`--component-input-fontSize\` / \`--component-input-lineHeight\` | \`14px\` / \`19px\` |
| Focus background | \`--component-input-bg-focus\` | \`--color-input-bg-focus\` → \`#E1EAFD\` |
| Focus border | \`--component-input-border-focus\` | \`--color-input-border-focus\` → \`#1C4599\` |
| Disabled background | \`--component-input-bg-disabled\` | \`--color-input-bg-disabled\` → \`#C6C6C6\` |
| Error border / message | \`--color-border-danger\` / \`--color-text-danger\` | \`--red-400\` → \`#F72B2B\` |

## States

- **Default** — white fill, \`#C7C7C7\` border (Figma resting variant).
- **Focus / active** — \`:focus-within\` swaps the fill to light blue \`#E1EAFD\` and the border to brand blue \`#1C4599\`, mirroring the Figma focus variant.
- **Error** — \`status="error"\` paints the border danger red, keeps a white fill on focus, and renders \`errorMessage\` in danger red below the field.
- **Disabled** — gray \`#C6C6C6\` fill, \`not-allowed\` cursor, text color preserved for readability.

## Accessibility

- Renders a native \`<input>\` with a real \`<label htmlFor>\` association — the id is auto-generated via \`useId()\` when not supplied.
- \`aria-invalid\` is set when \`status="error"\`.
- The helper/error message is linked to the input through \`aria-describedby\`, so screen readers announce it with the field.
- Focus state is communicated visually via the fill + border change on \`:focus-within\`; standard Tab / Shift+Tab keyboard behavior applies.
- Disabled fields use the native \`disabled\` attribute and are removed from the tab order.

## Usage

- **Do** keep labels short (1–3 words) so the 171px inline label column stays aligned across a form.
- **Do** provide an \`errorMessage\` whenever you set \`status="error"\` — the border alone is not sufficient feedback.
- **Do** use \`fullWidth\` inside modal/form layouts so fields align to the container grid.
- **Don't** use \`Input\` without a label for search bars — use \`TextField\` instead.
- **Don't** convey errors with placeholder text; placeholders disappear on entry.
`;

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label. Uses the component/input/label token (text-secondary gray).',
      table: { type: { summary: 'ReactNode' } },
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['left', 'top'],
      description: "left = inline (Figma form default) | top = stacked",
      table: { type: { summary: "'left' | 'top'" }, defaultValue: { summary: "'left'" } },
    },
    labelWidth: {
      control: 'text',
      description: 'Fixed label column width for labelPosition="left". Numbers are treated as px.',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: '171px' } },
    },
    status: {
      control: 'inline-radio',
      options: ['default', 'error'],
      description: 'Validation status — error uses the system danger tokens.',
      table: { type: { summary: "'default' | 'error'" }, defaultValue: { summary: "'default'" } },
    },
    helperText: {
      control: 'text',
      description: 'Helper / hint text below the field (replaced by errorMessage when status="error").',
      table: { type: { summary: 'ReactNode' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown below the field when status="error".',
      table: { type: { summary: 'ReactNode' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — gray fill from component/input/bg-disabled, removed from tab order.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    iconLeft: {
      control: false,
      description: 'Left adornment slot (icon). Rendered inside the pill before the input.',
      table: { type: { summary: 'ReactNode' } },
    },
    iconRight: {
      control: false,
      description: 'Right adornment slot (icon). Rendered inside the pill after the input.',
      table: { type: { summary: 'ReactNode' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch the wrapper and field to fill the container width.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: {
      control: false,
      description: 'Class applied to the outer wrapper element.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline style applied to the outer wrapper element.',
      table: { type: { summary: 'CSSProperties' } },
    },
    inputClassName: {
      control: false,
      description: 'Class applied to the native <input> element itself.',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Native placeholder text, styled with the component/input/placeholder token.',
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
        component: componentDescription,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/* ──────────────────────────────────────
   BASICS — inline-left label (Figma form default)
   ────────────────────────────────────── */

export const Default: Story = {
  args: { label: 'Component Name', placeholder: '' },
  parameters: {
    docs: {
      description: {
        story:
          'Resting state with the inline-left label (Figma form default): white fill, gray border, 25px pill radius. Click into the field to see the focus fill + brand border.',
      },
    },
  },
};

export const WithPlaceholder: Story = {
  name: 'With Placeholder',
  args: { label: 'API End Point URL', placeholder: 'Please enter Site collection URL' },
  parameters: {
    docs: {
      description: {
        story:
          'Placeholder text uses the component/input/placeholder token (#727171). Placeholders are hints only — never use them as a replacement for the label.',
      },
    },
  },
};

export const WithValue: Story = {
  name: 'With Value',
  args: { label: 'API Key', defaultValue: 'sk-lepide-9f2c…' },
  parameters: {
    docs: {
      description: {
        story: 'Filled state — entered text renders in the primary text color (#364765) at 14/19.',
      },
    },
  },
};

/* ──────────────────────────────────────
   LABEL POSITION
   ────────────────────────────────────── */

export const LabelTop: Story = {
  name: 'Label — Top (stacked)',
  args: { label: 'Deployed Model Name', labelPosition: 'top', placeholder: 'gpt-4o' },
  parameters: {
    docs: {
      description: {
        story:
          'Stacked layout via labelPosition="top" — useful in narrow containers where the 171px inline label column would crowd the field.',
      },
    },
  },
};

/* ──────────────────────────────────────
   STATES
   ────────────────────────────────────── */

export const Error: Story = {
  args: {
    label: 'API End Point URL',
    defaultValue: 'not-a-url',
    status: 'error',
    errorMessage: 'Please enter a valid Site collection URL.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'status="error" paints the border with the danger token, sets aria-invalid on the input, and shows errorMessage (linked via aria-describedby) in danger red below the field.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { label: 'Component Name', defaultValue: 'Lepide AI', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state uses the component/input/bg-disabled gray (#C6C6C6) and the native disabled attribute, removing the field from the tab order.',
      },
    },
  },
};

/* ──────────────────────────────────────
   FIGMA PARITY — "Add Credentials for Lepide AI"
   ────────────────────────────────────── */

export const AddCredentialsForm: Story = {
  name: '✦ Add Credentials (Figma)',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'White' },
    docs: {
      description: {
        story:
          'Pixel-parity recreation of the Figma "Add Credentials for Lepide AI" modal — four fullWidth inline-label inputs sharing the 171px label column, plus the Button footer.',
      },
    },
  },
  render: () => (
    <div
      style={{
        width: 711,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-modal, 0 8px 24px rgba(0,0,0,0.15))',
        fontFamily: "'Open Sans', sans-serif",
        background: '#fff',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0',
          fontWeight: 700,
          fontSize: 18,
          color: 'var(--blue-600, #1c4599)',
        }}
      >
        Add Credentials for Lepide AI
      </div>
      <div style={{ background: 'var(--gray-50, #f5f7fd)', padding: '32px 33px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Input label="Component Name" fullWidth />
          <Input label="API End Point URL" fullWidth />
          <Input label="API Key" fullWidth />
          <Input label="Deployed Model Name" fullWidth />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Done</Button>
        </div>
      </div>
    </div>
  ),
};

/* ──────────────────────────────────────
   KITCHEN SINK — All states
   ────────────────────────────────────── */

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Side-by-side overview of every visual state — default, filled, error, disabled, and stacked label — for quick QA against the Figma variants.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: 560 }}>
      <Input label="Default" placeholder="Placeholder text" fullWidth />
      <Input label="With value" defaultValue="Lepide AI" fullWidth />
      <Input label="Error" defaultValue="bad-value" status="error" errorMessage="Something is not right." fullWidth />
      <Input label="Disabled" defaultValue="Lepide AI" disabled fullWidth />
      <Input label="Top label" labelPosition="top" placeholder="Stacked layout" fullWidth />
    </div>
  ),
};
