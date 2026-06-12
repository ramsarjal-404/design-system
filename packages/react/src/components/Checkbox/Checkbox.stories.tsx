import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Checkbox } from './Checkbox';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Binary form control built on a native \`<input type="checkbox">\`.

No dedicated Figma frame yet — built token-first; add the frame and node link when designed.

## Overview

\`Checkbox\` collects a yes/no choice that is submitted with a form — accept terms, include an
option, select rows. It reuses the dropdown checkbox token pair
(\`--component-dropdown-checkbox-border/-fill\`) so the multi-select \`Dropdown\` and standalone
checkboxes never drift. Works uncontrolled (\`defaultChecked\`) or controlled
(\`checked\` + \`onChange\`), and supports \`indeterminate\` for partially-selected groups.

If the change applies instantly, prefer **Toggle**; if the choice is one-of-many, use **Radio**
or **Dropdown**.

## Anatomy

- **Box** — 16px square, \`--radius-3xs\` corners, 1px brand border; fills brand blue when
  checked or indeterminate.
- **Glyph** — white check (checked) or dash (indeterminate), inline SVG, \`aria-hidden\`.
- **Label** — optional text inside a real \`<label>\` wrapper, so clicking it toggles the box.
- **Input** — the native checkbox, visually hidden over the box; keeps native keyboard and
  screen-reader behavior.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Border | \`--component-dropdown-checkbox-border\` | \`--color-border-brand\` → #1C4599 |
| Fill (checked) | \`--component-dropdown-checkbox-fill\` | \`--color-brand-primary\` → #1C4599 |
| Box background | \`--color-background-surface\` | white |
| Glyph | \`--color-text-inverse\` | white |
| Border (error) | \`--color-status-error-text\` | \`--red-400\` → #F72B2B |
| Fill (disabled checked) | \`--color-button-disabled-bg\` | \`--gray-400\` → #C6C6C6 |
| Label | \`--color-text-primary\` | \`--gray-700\` → #364765 |
| Focus ring | \`--color-focus-ring\` | rgba(28, 69, 153, 0.35) |
| Radius | \`--radius-3xs\` | 3px |

## States & variants

Unchecked, checked, indeterminate ("mixed"), error, disabled (each of the above), plus
keyboard focus (\`:focus-visible\` ring). Transitions respect \`prefers-reduced-motion\`.

## Accessibility

- Native \`<input type="checkbox">\` — toggles with click and Space, participates in forms,
  announces checked state natively.
- \`indeterminate\` sets the DOM property **and** \`aria-checked="mixed"\`.
- \`error\` sets \`aria-invalid\` — pair it with visible error text near the group.
- Always name it: pass \`label\`, or \`aria-label\` when the context labels it visually.

## Usage

- **Do** use a checkbox when the value is collected and submitted — not applied instantly.
- **Do** use \`indeterminate\` on a "select all" parent over a partially-selected list.
- **Don't** use a checkbox for one-of-many choices — that's **Radio**.
- **Don't** rely on color alone for the error state — show a message as well.
`;

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state. Pair with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Uncontrolled initial state.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: {
      description: 'Called with the next checked state (and the raw change event) on toggle.',
      table: { type: { summary: '(checked: boolean, event: ChangeEvent) => void' } },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Mixed state — dash glyph, `aria-checked="mixed"`. Set by a parent tracking a partially-selected group.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — gray box and label, interaction blocked.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description: 'Visible label rendered in a real `<label>` wrapper — clicking it toggles the box.',
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'Enable audit trail' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Enable audit trail' });

    // Click toggles.
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Space toggles back off.
    checkbox.focus();
    await userEvent.keyboard(' ');
    expect(checkbox).not.toBeChecked();

    // Clicking the label text toggles too (real <label> wrapper).
    await userEvent.click(canvas.getByText('Enable audit trail'));
    expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  args: { label: 'Include subfolders', defaultChecked: true },
  parameters: {
    docs: { description: { story: 'Checked — brand-blue fill with a white check glyph.' } },
  },
};

export const Indeterminate: Story = {
  args: { label: 'Select all permissions', indeterminate: true },
  parameters: {
    docs: {
      description: {
        story:
          'Mixed state for a "select all" parent over a partially-selected list — dash glyph, `aria-checked="mixed"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Select all permissions' });
    // the DOM indeterminate flag is set by a ref effect — wait for it on cold loads
    await waitFor(() => {
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    });
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Disabled pair — gray box and label, interaction blocked.' } },
  },
};

export const WithError: Story = {
  args: { label: 'I accept the terms', error: true },
  parameters: {
    docs: {
      description: {
        story:
          'Error state for an invalid required choice — status-error border plus `aria-invalid`. Pair with visible error text.',
      },
    },
  },
};

export const Group: Story = {
  name: 'Group example',
  render: () => {
    const OPTIONS = ['Read', 'Write', 'Delete'] as const;
    const [selected, setSelected] = useState<string[]>(['Read']);
    const allChecked = selected.length === OPTIONS.length;
    const someChecked = selected.length > 0 && !allChecked;
    return (
      <fieldset
        style={{
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontFamily: 'var(--font-family-primary)',
        }}
      >
        <legend
          style={{
            padding: '0 var(--space-2)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}
        >
          Permissions
        </legend>
        <Checkbox
          label="All permissions"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(next) => setSelected(next ? [...OPTIONS] : [])}
        />
        {OPTIONS.map((option) => (
          <div key={option} style={{ paddingLeft: 24 }}>
            <Checkbox
              label={option}
              checked={selected.includes(option)}
              onChange={(next) =>
                setSelected((prev) => (next ? [...prev, option] : prev.filter((o) => o !== option)))
              }
            />
          </div>
        ))}
      </fieldset>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Controlled group inside a `<fieldset>` with a "select all" parent that goes indeterminate while the list is partially selected.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Error" error />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Every visual state stacked for quick QA: unchecked, checked, indeterminate, error, and the disabled pair.',
      },
    },
  },
};
