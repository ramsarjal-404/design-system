import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Filter, applyFilterConditions } from './index';
import type { FilterCondition } from './Filter.types';
import { Button } from '../Button';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The "Modify Filters" drawer matching the Design Essentials frame
([node 369:6362](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=369-6362)).

## Overview

\`Filter\` builds field conditions in a right-hand drawer, covering all three Figma states:

1. **Panel** — brand header, a field **Dropdown**, the full-width **Condition** button (disabled
   until a field is chosen), applied-condition cards, and the Cancel/Apply footer.
2. **Field selector** — \`fields\` drive the Dropdown; each field carries its candidate \`values\`.
3. **Criteria card** — "Filter by {field}" on the brand-light strip, a criteria **Dropdown**
   (\`criteriaOptions\`, default Equals / Not Equals / Contains), a search field narrowing the
   value checkboxes, and a card-level Apply that stays **disabled until a value is checked**.

Edits are **drafted**: nothing reaches the page until the footer Apply fires
\`onApply(conditions)\`; Cancel or Escape discards the draft. Each applied condition renders as a
secondary-blue card with an edit pencil that reopens its criteria. Pair with the exported
\`applyFilterConditions(items, conditions, getValue)\` helper to filter rows — \`values: ['All']\`
matches everything.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Header | \`--color-brand-primary\` + \`--color-text-inverse\`, bold \`--font-size-20\` | #1C4599 / white |
| Panel | \`--gray-50\` | #F5F7FD (frame literal #F8F9FB — flagged) |
| Criteria card header | \`--color-brand-light\` | #E4EDFF |
| Search field | \`--color-border-default\`, \`--radius-6xl\` 30px, body-lg brand text | |
| Value box | \`--color-button-disabled-bg\` border, \`--radius-xxs\` 5px | |
| Checkboxes | \`--color-brand-primary\` accent, 16px | |
| Applied card | \`--color-button-secondary-bg\`, \`--radius-md\` 10px | #C6D8FF (frame literal #C5D9FD — flagged) |
| Buttons | the **Button** component (Condition/Cancel/Apply incl. real disabled state) | |

## Accessibility

- The drawer is \`role="dialog"\` named by its title; **Escape** cancels.
- Condition and the card Apply expose real \`disabled\` states; value rows are native labeled
  checkboxes; edit pencils carry "Edit {field} filter" labels.
- In product code, move focus into the drawer on open and restore it on close.

## Usage

- **Do** derive each field's \`values\` from real data so the checkboxes are always honest.
- **Do** keep the committed conditions in page state and re-filter rows only on \`onApply\`.
- **Don't** mutate results while the drawer is open — the draft model exists so users can
  back out with Cancel.
`;

const FIELDS = [
  { id: 'serverName', label: 'Server Name', values: ['DE10016.LDSP1.com', 'DE10016.LDSP2.com', 'DE10016.LDSP3.com'] },
  { id: 'objectClass', label: 'Object Class', values: ['account', 'ACSPolicy', 'ACSResourceLimits', 'ACSSubnet', 'AddressBookContainer', 'user', 'group'] },
  { id: 'operation', label: 'Operation', values: ['Modified', 'Created', 'Deleted', 'Renamed'] },
  { id: 'whoModified', label: 'Who Modified', values: ['LPDE\\administrator', 'LPDE\\d.murphy', 'LPDE\\k.watson'] },
];

const meta: Meta<typeof Filter> = {
  title: 'Forms/Filter',
  component: Filter,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean', description: 'Show the drawer.' },
    fields: { description: 'Filterable fields with candidate values.', table: { type: { summary: 'FilterField[]' } } },
    conditions: { description: 'Committed conditions shown on open.', table: { type: { summary: 'FilterCondition[]' } } },
    criteriaOptions: {
      description: 'Criteria offered per condition.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: "['Equals', 'Not Equals', 'Contains']" } },
    },
    title: { control: 'text', table: { defaultValue: { summary: "'Modify Filters'" } } },
    width: { control: 'number', table: { defaultValue: { summary: '420' } } },
    onApply: { table: { type: { summary: '(conditions: FilterCondition[]) => void' } } },
    onCancel: { table: { type: { summary: '() => void' } } },
  },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=369-6362',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [conditions, setConditions] = useState<FilterCondition[]>([
      { field: 'serverName', criteria: 'Equals', values: ['All'] },
    ]);
    return (
      <div style={{ minHeight: 480, padding: 24, fontFamily: 'var(--font-family-primary)' }}>
        <Button variant="primary" onClick={() => setOpen(true)}>Open Filters</Button>
        <p style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>
          Applied: {conditions.map((c) => `${c.field} {${c.criteria} [${c.values.join(', ')}]}`).join(' , ')}
        </p>
        <Filter
          open={open}
          fields={FIELDS}
          conditions={conditions}
          onApply={(next) => { setConditions(next); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The full flow: pick a field, open Condition, check values (Apply enables), apply the card, then commit with the footer Apply — the applied line updates only then.',
      },
    },
  },
};

export const FilteringAList: Story = {
  name: 'Filtering a list (live)',
  render: () => {
    const [open, setOpen] = useState(false);
    const [conditions, setConditions] = useState<FilterCondition[]>([]);
    const items = [
      { name: 'Object-01', objectClass: 'user', operation: 'Modified' },
      { name: 'Object-02', objectClass: 'group', operation: 'Created' },
      { name: 'Object-03', objectClass: 'user', operation: 'Deleted' },
      { name: 'Object-04', objectClass: 'account', operation: 'Modified' },
    ];
    const visible = applyFilterConditions(items, conditions, (item, fieldId) =>
      String(item[fieldId as keyof typeof item])
    );
    return (
      <div style={{ minHeight: 420, padding: 24, fontFamily: 'var(--font-family-primary)', fontSize: 14, color: 'var(--color-text-primary)' }}>
        <Button variant="primary" onClick={() => setOpen(true)}>Modify Filters</Button>
        <ul>
          {visible.map((i) => (
            <li key={i.name}>{i.name} — {i.objectClass} — {i.operation}</li>
          ))}
          {visible.length === 0 && <li>No items match the filters.</li>}
        </ul>
        <Filter
          open={open}
          fields={FIELDS.filter((f) => ['objectClass', 'operation'].includes(f.id))}
          conditions={conditions}
          onApply={(next) => { setConditions(next); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'The exported `applyFilterConditions` helper filtering a list as conditions are committed.',
      },
    },
  },
};
