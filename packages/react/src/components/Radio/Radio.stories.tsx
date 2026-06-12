import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

One-of-many form control built on a native \`<input type="radio">\`, with a \`RadioGroup\` helper.

No dedicated Figma frame yet — built token-first; add the frame and node link when designed.

## Overview

\`Radio\` picks exactly one option from a small visible set — scan scope, severity level,
export format. Each option is a native radio visually hidden over a 16px round control with a
brand-blue inner dot. Wrap options in **\`RadioGroup\`** (same folder) to get
\`role="radiogroup"\`, a shared \`name\`, and controlled (\`value\` + \`onChange\`) or uncontrolled
(\`defaultValue\`) selection without manual wiring.

For 5+ options or constrained space use **Dropdown**; for independent yes/no choices use
**Checkbox**; for an instant on/off setting use **Toggle**.

## Anatomy

- **Circle** — 16px round outline, 1px brand border (the dropdown checkbox border token).
- **Dot** — 8px \`--color-brand-primary\` inner circle, scales in when selected.
- **Label** — optional text inside a real \`<label>\` wrapper, so clicking the text selects.
- **Group** — \`role="radiogroup"\` wrapper with optional label (\`aria-labelledby\`), vertical
  by default, \`orientation="horizontal"\` for a row.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Border | \`--component-dropdown-checkbox-border\` | \`--color-border-brand\` → #1C4599 |
| Dot | \`--color-brand-primary\` | \`--blue-600\` → #1C4599 |
| Circle background | \`--color-background-surface\` | white |
| Border (error) | \`--color-status-error-text\` | \`--red-400\` → #F72B2B |
| Disabled border/dot | \`--color-text-disabled\` | \`--gray-500\` → #727171 |
| Label | \`--color-text-primary\` | \`--gray-700\` → #364765 |
| Group label | \`--color-text-secondary\` | gray |
| Focus ring | \`--color-focus-ring\` | rgba(28, 69, 153, 0.35) |
| Radius | \`--radius-circle\` | 9999px |

## States & variants

Unselected, selected, error, disabled (per option or whole group via \`RadioGroup disabled\`),
keyboard focus (\`:focus-visible\` ring), and the two group orientations. Transitions respect
\`prefers-reduced-motion\`.

## Accessibility

- Native radios sharing a \`name\` — **arrow keys move selection natively**, Tab enters/leaves
  the group as one stop, and forms submit the selected value.
- \`RadioGroup\` renders \`role="radiogroup"\` and wires \`aria-labelledby\` to its label.
- \`error\` sets \`aria-invalid\` — pair it with visible error text near the group.
- Always label options (\`label\` prop or \`aria-label\`).

## Usage

- **Do** preselect a sensible default — radio groups should rarely start empty.
- **Do** keep groups to 2–5 options; beyond that, reach for **Dropdown**.
- **Don't** use radios for multi-select — that's **Checkbox**.
- **Don't** mix radios of different groups visually without clear separation.
`;

const meta: Meta<typeof Radio> = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The value this option submits / reports when selected.',
      table: { type: { summary: 'string' } },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled selected state. Inside a `RadioGroup` this is wired for you.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Uncontrolled initial state.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: {
      description: "Called with the option's value (and the raw change event) when selected.",
      table: { type: { summary: '(value: string, event: ChangeEvent) => void' } },
    },
    name: {
      control: 'text',
      description: 'Radio group name shared by every option. `RadioGroup` sets it.',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — gray circle and label, interaction blocked.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description: 'Visible label rendered in a real `<label>` wrapper — clicking it selects.',
      table: { type: { summary: 'ReactNode' } },
    },
    error: {
      control: 'boolean',
      description: 'Error state — status-error border. Also sets `aria-invalid`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: {
      control: false,
      description: 'Extra class on the root `<label>` wrapper.',
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
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: { label: 'Full scan', name: 'scan-default', value: 'full' },
};

export const Group: Story = {
  name: 'Group (controlled)',
  render: () => {
    const [scope, setScope] = useState('changed');
    return (
      <RadioGroup name="scan-scope" label="Scan scope" value={scope} onChange={setScope}>
        <Radio value="full" label="Full scan" />
        <Radio value="changed" label="Changed files only" />
        <Radio value="custom" label="Custom paths" />
      </RadioGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Controlled `RadioGroup` — it shares the `name`, exposes `role="radiogroup"` labelled by "Scan scope", and reports the selected value via `onChange`. Arrow-key movement between options is native browser behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The group is exposed with its accessible name.
    const group = canvas.getByRole('radiogroup', { name: 'Scan scope' });
    expect(group).toBeVisible();

    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(canvas.getByRole('radio', { name: 'Changed files only' })).toBeChecked();

    // Clicking another option selects it — and exactly one stays checked.
    await userEvent.click(canvas.getByRole('radio', { name: 'Full scan' }));
    expect(canvas.getByRole('radio', { name: 'Full scan' })).toBeChecked();
    expect(radios.filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);

    // Clicking a label also selects (real <label> wrapper).
    await userEvent.click(canvas.getByText('Custom paths'));
    expect(canvas.getByRole('radio', { name: 'Custom paths' })).toBeChecked();
    expect(radios.filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
  },
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup name="severity" label="Severity" defaultValue="medium" orientation="horizontal">
      <Radio value="low" label="Low" />
      <Radio value="medium" label="Medium" />
      <Radio value="high" label="High" />
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Uncontrolled group (`defaultValue`) laid out as a row via `orientation="horizontal"`.',
      },
    },
  },
};

export const DisabledOption: Story = {
  name: 'Disabled option',
  render: () => (
    <RadioGroup name="export" label="Export format" defaultValue="csv">
      <Radio value="csv" label="CSV" />
      <Radio value="json" label="JSON" />
      <Radio value="xml" label="XML (requires Enterprise plan)" disabled />
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A single disabled option inside an otherwise interactive group — explain why nearby.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Radio name="all-1" label="Unselected" />
      <Radio name="all-2" label="Selected" defaultChecked />
      <Radio name="all-3" label="Error" error />
      <Radio name="all-4" label="Disabled" disabled />
      <Radio name="all-5" label="Disabled selected" disabled defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Every visual state stacked for quick QA (each on its own `name` so the states don\'t collapse): unselected, selected, error, and the disabled pair.',
      },
    },
  },
};
