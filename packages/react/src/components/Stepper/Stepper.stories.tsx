import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Stepper } from './Stepper';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Number stepper / spinner matching the Figma "Changing Up-down" component (node 391:133).

## Overview

\`Stepper\` is the numeric entry control of the Lepidus design system: a 230px, 30px-radius pill showing a brand-blue value with stacked chevron up/down controls. Use it for bounded numeric settings — counts, thresholds, retention days — where small adjustments are common. It supports both controlled (\`value\` + \`onChange\`) and uncontrolled (\`defaultValue\`) usage, clamping to \`min\`/\`max\`.

Do **not** use it for free-form numeric strings (phone numbers, IDs) — use \`Input\` (labeled form field) instead. For text entry, see \`Input\`, \`TextField\`, or \`Textarea\`.

## Anatomy

- **Pill wrapper** — 30px-radius shell (230px × 40px) carrying the surface fill, 1px border, and 10/14 padding.
- **Number input** — transparent native \`<input type="number">\` with the browser spinner hidden; value renders in brand blue at 16/22.
- **Controls** — stacked chevron-up / chevron-down buttons in brand blue that increment/decrement by \`step\`, disabling at the \`max\`/\`min\` bounds; hidden via \`showControls={false}\`.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Background | \`--component-stepper-bg\` | \`--color-background-surface\` → \`#FFFFFF\` |
| Border | \`--component-stepper-border\` | \`--color-border-default\` → \`#C7C7C7\` |
| Value text | \`--component-stepper-text\` | \`--color-text-brand\` → \`#1C4599\` |
| Chevron controls | \`--component-stepper-control\` | \`--color-text-brand\` → \`#1C4599\` |
| Disabled background | \`--component-stepper-disabled-bg\` | \`--color-button-disabled-bg\` → \`#C6C6C6\` |
| Disabled text / controls | \`--component-stepper-disabled-text\` | \`--color-text-disabled\` → \`#727171\` |
| Radius | \`--radius-6xl\` | \`30px\` |
| Padding | \`--space-5\` / \`--space-18\` | \`10px\` / \`14px\` |
| Type | \`--typography-body-lg-fontSize\` / \`-lineHeight\` | \`16px\` / \`22px\` |
| Control focus ring | \`--color-border-brand\` | \`#1C4599\` |

## States

- **Default** — white pill, gray border, brand-blue value and chevrons (Figma "Changing Up-down" resting variant).
- **At bound** — the up or down chevron disables individually (gray) once the value reaches \`max\` or \`min\`.
- **Disabled** — gray \`#C6C6C6\` fill, transparent border, \`#727171\` value, both controls inert.

## Accessibility

- Renders a native \`<input type="number" inputMode="numeric">\`, so platform numeric keyboards and assistive-tech number semantics apply.
- Exposes \`aria-valuenow\`, plus \`aria-valuemin\` / \`aria-valuemax\` when finite \`min\` / \`max\` are set.
- **Keyboard** — Arrow Up / Arrow Down adjust the value via the native number input; values can also be typed directly (drafts are clamped to \`min\`/\`max\` on blur).
- The chevron buttons have \`aria-label="Increment"\` / \`"Decrement"\` and \`tabIndex={-1}\` so keyboard users interact through the input only (one Tab stop); the buttons keep a visible brand focus ring for \`:focus-visible\`.
- No built-in label — supply \`aria-label\` or an external \`<label>\`/\`aria-labelledby\`.

## Usage

- **Do** set finite \`min\` and \`max\` so the chevrons disable at the bounds and ARIA range attributes are exposed.
- **Do** use a controlled pattern (\`value\` + \`onChange\`) when the value drives other UI.
- **Do** give every Stepper an accessible name (e.g. \`aria-label="Retention days"\`).
- **Don't** use Stepper for large, arbitrary numbers — typing into an \`Input\` is faster than stepping.
- **Don't** hide the controls (\`showControls={false}\`) unless an adjacent control provides the same affordance.
`;

const meta: Meta<typeof Stepper> = {
  title: 'Forms/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: false,
      description: 'Current value (controlled). Pair with onChange.',
      table: { type: { summary: 'number' } },
    },
    defaultValue: {
      control: 'number',
      description: 'Initial value (uncontrolled), clamped to min/max.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value. When finite, exposed as aria-valuemin and disables the down chevron at the bound.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '-Infinity' } },
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value. When finite, exposed as aria-valuemax and disables the up chevron at the bound.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'Infinity' } },
    },
    step: {
      control: 'number',
      description: 'Increment / decrement amount applied by the chevron controls.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    showControls: {
      control: 'boolean',
      description: 'Show or hide the stacked up / down chevron controls.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — uses the component/stepper/disabled-* tokens and removes the field from the tab order.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to fill the container (default fixed 230px from Figma).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: {
      control: false,
      description: 'Fired with the clamped numeric value when it changes (buttons, typing, or arrow keys).',
      table: { type: { summary: '(value: number) => void' } },
    },
    className: {
      control: false,
      description: 'Class applied to the outer pill wrapper.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=391-133',
    },
    docs: {
      description: {
        component: componentDescription,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: { defaultValue: 10 },
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled stepper with an unbounded range — adjust via the chevrons, Arrow Up / Down, or by typing directly.',
      },
    },
  },
};

export const WithRange: Story = {
  name: 'With min / max',
  args: { defaultValue: 10, min: 0, max: 20, step: 1 },
  parameters: {
    docs: {
      description: {
        story:
          'Bounded range (0–20): values are clamped, aria-valuemin/-valuemax are exposed, and each chevron disables at its bound.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    const increment = canvas.getByRole('button', { name: 'Increment' });
    const decrement = canvas.getByRole('button', { name: 'Decrement' });

    // Starts at the defaultValue with the bounded range exposed via ARIA.
    expect(input).toHaveValue(10);
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '20');

    // Increment: 10 → 11.
    await userEvent.click(increment);
    await waitFor(() => expect(input).toHaveValue(11));

    // Decrement twice: 11 → 10 → 9.
    await userEvent.click(decrement);
    await waitFor(() => expect(input).toHaveValue(10));
    await userEvent.click(decrement);
    await waitFor(() => expect(input).toHaveValue(9));

    // Typing an out-of-range draft clamps to max (20) when the field blurs…
    await userEvent.clear(input);
    await userEvent.type(input, '999');
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue(20));

    // …and at the max bound the up chevron disables.
    await waitFor(() => expect(increment).toBeDisabled());
    expect(decrement).toBeEnabled();
  },
};

export const NoControls: Story = {
  args: { defaultValue: 10, showControls: false },
  parameters: {
    docs: {
      description: {
        story:
          'showControls={false} hides the chevrons — the value remains editable by typing or with Arrow Up / Down.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: 10, disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — gray fill and text from the component/stepper/disabled-* tokens; input and controls are inert.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Overview of the main configurations — bounded default, controls hidden, and disabled — for quick visual QA against the Figma variants.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}>
      <Stepper defaultValue={10} min={0} max={99} />
      <Stepper defaultValue={10} showControls={false} />
      <Stepper defaultValue={10} disabled />
    </div>
  ),
};
