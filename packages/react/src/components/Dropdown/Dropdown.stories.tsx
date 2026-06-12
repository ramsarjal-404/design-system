import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Dropdown } from './Dropdown';

const OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const meta: Meta<typeof Dropdown> = {
  title: 'Forms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    options: {
      description:
        'Array of selectable options (`{ value, label?, disabled? }`). `label` defaults to `value`; `disabled` greys out a single row.',
      control: false,
      table: { type: { summary: 'DropdownOption[]' } },
    },
    value: {
      description:
        'Controlled selection. Pass a `string[]` in `multiple` mode, a `string` otherwise. When set, the component never stores selection internally.',
      control: false,
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      description: 'Initial selection for uncontrolled usage.',
      control: false,
      table: { type: { summary: 'string | string[]' } },
    },
    multiple: {
      description:
        'Enables multi-select: option rows gain leading checkboxes and clicking a row toggles it without closing the panel.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showButtons: {
      description:
        'Adds a Cancel / Apply footer. Only meaningful with `multiple`; switches the panel to a draft-then-Apply commit model.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    placeholder: {
      description:
        'Text shown on the trigger when nothing is selected, and on the blue panel header while open.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Select'" } },
    },
    disabled: {
      description:
        'Disables the whole control — grey fill and text via the `component/dropdown/disabled-*` tokens; the panel cannot open.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: {
      description:
        'Fired whenever the committed selection changes. Receives a `string[]` in `multiple` mode, a `string` otherwise. With `showButtons`, fires only on Apply.',
      control: false,
      table: { type: { summary: '(value: string | string[]) => void' } },
    },
    onApply: {
      description: 'Fired when the Apply footer button is pressed (`showButtons` mode). Receives the draft selection.',
      control: false,
      table: { type: { summary: '(value: string[]) => void' } },
    },
    onCancel: {
      description: 'Fired when the Cancel footer button is pressed (`showButtons` mode). The draft selection is discarded.',
      control: false,
      table: { type: { summary: '() => void' } },
    },
    className: {
      description: 'Class applied to the outer wrapper element.',
      control: false,
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=49-118',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Select / multi-select dropdown matching the Figma **DropDown** component (node **49:118**).

## Overview
\`Dropdown\` is the system's pill-shaped select for choosing one or many values from a fixed list. Use it for filters, form selects and table controls where the option set is known and short enough to scan. Prefer a plain **Input** for free text, and the **Pagination** page-size popover already covers the rows-per-page case — don't rebuild it with this component. For long, searchable lists consider a dedicated combobox instead; this component does not filter.

## Anatomy
- **Trigger pill** — rounded (30px) bordered button showing the selection (or placeholder) plus a chevron.
- **Panel** — absolutely positioned overlay that replaces the trigger when open (single-panel Figma open state).
- **Blue header** — \`header-bg\` bar with the placeholder text and chevron; clicking it closes the panel.
- **Option rows** — 40px rows; with \`multiple\`, each row leads with an outlined brand-blue checkbox.
- **Cancel / Apply footer** — optional (\`showButtons\`), reuses the system **Button** (secondary + primary).

## Design tokens
| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Trigger / panel background | \`--component-dropdown-bg\` | \`color/background/surface\` → #ffffff |
| Trigger border, footer divider | \`--component-dropdown-border\` | \`color/border/default\` → #c7c7c7 |
| Trigger & header text | \`--component-dropdown-trigger-text\` | \`color/text/brand\` → #1c4599 |
| Open header bar | \`--component-dropdown-header-bg\` | \`color/button/secondary/bg\` → #c6d8ff |
| Option text | \`--component-dropdown-option-text\` | \`color/text/brand\` → #1c4599 |
| Option hover | \`--component-dropdown-item-hover\` | \`color/background/subtle\` → #f6f6f6 |
| Checkbox border | \`--component-dropdown-checkbox-border\` | \`color/border/brand\` → #1c4599 |
| Checkbox check | \`--component-dropdown-checkbox-fill\` | \`color/brand/primary\` → #1c4599 |
| Disabled fill | \`--component-dropdown-disabled-bg\` | \`color/button/disabled/bg\` → #c6c6c6 |
| Disabled text | \`--component-dropdown-disabled-text\` | \`color/text/disabled\` → #727171 |
| Pill / panel radius | \`--radius-6xl\` | 30px |

## States & variants
The six Figma variants map onto three props:
- **Select (single)** — default; no \`multiple\`, no \`showButtons\`.
- **Without checkbox** — same single-select rendering (rows have no leading checkbox).
- **Multi-select** — \`multiple\`; rows gain checkboxes, panel stays open while toggling.
- **With buttons** — \`multiple + showButtons\`; Cancel/Apply footer appears.
- **Disabled** — \`disabled\`; grey pill via \`component/dropdown/disabled-*\`, panel never opens.
- **Open** — interaction state; the blue header replaces the trigger in place.

## Behavior
- Clicking the trigger toggles the panel; the trigger is visually hidden (layout preserved) while open so the blue header sits exactly in its slot.
- Outside click and **Escape** close the panel (document-level listeners attached only while open).
- Single-select: clicking an option commits it and closes the panel immediately.
- Multi-select without buttons: each click commits instantly via \`onChange\`; the panel stays open.
- Multi-select with buttons: clicks edit a **draft**; **Apply** commits (\`onChange\` + \`onApply\`) and closes, **Cancel** discards and closes. The draft re-syncs to the committed selection each time the panel opens.
- Works controlled (\`value\` + \`onChange\`) or uncontrolled (\`defaultValue\`).
- Trigger text joins all selected labels with commas and ellipsizes on overflow.

## Accessibility
- Trigger is a native \`<button>\` with \`aria-haspopup="listbox"\` and \`aria-expanded\`.
- Panel uses \`role="listbox"\` with \`aria-multiselectable\` in \`multiple\` mode; each row is a \`role="option"\` button with \`aria-selected\`.
- Per-option \`disabled\` uses the native button disabled state.
- **Escape** closes the panel; checkmark icons and the chevron are \`aria-hidden\`.
- Trigger shows a 2px brand focus ring via \`:focus-visible\`.

## Usage
- **Do** use \`showButtons\` when a multi-select drives an expensive operation (e.g. refetching a filtered table) so users commit once via Apply.
- **Do** keep option labels short — the trigger joins them with commas and truncates.
- **Do** pass stable, unique \`value\` strings; they are used as React keys and selection identity.
- **Don't** set \`showButtons\` without \`multiple\` — the footer only renders in multi-select mode.
- **Don't** use it for option sets that need search or async loading.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Select: Story = {
  name: 'Select (single)',
  args: { options: OPTIONS, placeholder: 'Select' },
  parameters: {
    docs: {
      description: {
        story:
          'Default single-select. Clicking an option commits it immediately and closes the panel; the trigger shows the chosen label.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Closed: the trigger is the only visible button (aria-haspopup listbox).
    const trigger = canvas.getByRole('button', { name: 'Select' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open the panel. The trigger gets visibility:hidden (triggerHidden) while
    // open, so query the listbox / header instead of the trigger from here on.
    await userEvent.click(trigger);
    const listbox = await canvas.findByRole('listbox');
    expect(listbox).toBeVisible();
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(10);

    // Selecting an option commits it and closes the panel immediately.
    await userEvent.click(options[2]);
    await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());

    // Trigger is visible again, collapsed, and shows the committed selection.
    const reopened = canvas.getByRole('button', { name: 'Option 3' });
    expect(reopened).toHaveAttribute('aria-expanded', 'false');
    expect(reopened).toHaveTextContent('Option 3');

    // Re-open: the previously clicked option is now aria-selected.
    await userEvent.click(reopened);
    const listboxAgain = await canvas.findByRole('listbox');
    await waitFor(() =>
      expect(within(listboxAgain).getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
    );

    // Escape closes the panel again, leaving the story in its resting state.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

export const Disabled: Story = {
  args: { options: OPTIONS, placeholder: 'Select', disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — grey fill and text from the `component/dropdown/disabled-*` tokens; the panel cannot be opened.',
      },
    },
  },
};

export const MultiWithButtons: Story = {
  name: 'Multi-select with buttons',
  args: {
    options: OPTIONS,
    placeholder: 'Select',
    multiple: true,
    showButtons: true,
    defaultValue: ['opt-1', 'opt-2', 'opt-3'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select with the Cancel / Apply footer. Checkbox toggles edit a draft selection that is only committed when Apply is pressed.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Trigger shows the three preselected labels joined with commas.
    const trigger = canvas.getByRole('button', { name: /Option 1/ });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    await userEvent.click(trigger);

    const listbox = await canvas.findByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    const options = within(listbox).getAllByRole('option');

    // opt-4 and opt-5 start unselected; toggling flips aria-selected to true.
    expect(options[3]).toHaveAttribute('aria-selected', 'false');
    expect(options[4]).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(options[3]);
    await waitFor(() => expect(options[3]).toHaveAttribute('aria-selected', 'true'));
    await userEvent.click(options[4]);
    await waitFor(() => expect(options[4]).toHaveAttribute('aria-selected', 'true'));

    // Panel stays open while toggling (draft model)…
    expect(canvas.getByRole('listbox')).toBeVisible();

    // …and Apply commits the draft and closes the panel.
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());
    expect(canvas.getByRole('button', { name: /Option 1/ })).toHaveAttribute('aria-expanded', 'false');
  },
};

export const MultiWithoutButtons: Story = {
  name: 'Multi-select, no buttons',
  args: {
    options: OPTIONS,
    placeholder: 'Select',
    multiple: true,
    defaultValue: ['opt-1'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select without the footer: every checkbox toggle commits instantly through `onChange` while the panel stays open.',
      },
    },
  },
};

export const WithoutCheckbox: Story = {
  name: 'Without checkbox',
  args: { options: OPTIONS, placeholder: 'Select' },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "Without checkbox" variant — single-select rows render plain labels with no leading checkbox.',
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
        story:
          'Side-by-side gallery of the prop combinations: single, disabled, multi-select, and multi-select with the Cancel/Apply footer.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Dropdown options={OPTIONS} placeholder="Select" />
      <Dropdown options={OPTIONS} placeholder="Select" disabled />
      <Dropdown options={OPTIONS} placeholder="Select" multiple defaultValue={['opt-1', 'opt-2']} />
      <Dropdown options={OPTIONS} placeholder="Select" multiple showButtons defaultValue={['opt-1', 'opt-2']} />
    </div>
  ),
};
