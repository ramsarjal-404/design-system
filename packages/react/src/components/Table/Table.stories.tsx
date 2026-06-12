import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import type { TableColumn } from './Table.types';
import { Badge } from '../Badge';
import { Button } from '../Button';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Data table matching the Figma "Table" component (node 7:959).

## Overview

\`Table\` renders tabular data with the three header behaviors from the design built in: **sorting**
(every column header is a button with the arrow indicator), **per-column search** (the magnifier row
under the header) and **row selection** (brand-bordered checkboxes inside the first column, with a
select-all checkbox in the header). All three work client-side out of the box on the \`data\` you
pass; \`sort\`, \`filters\` and \`selectedKeys\` can each be controlled instead for server-driven tables.

Cells render \`row[column.key]\` by default; use \`render\` for custom content (Badges, Buttons,
Progress) and keep \`value\` alongside it so the column stays sortable and filterable. For paging,
compose with **Pagination** — see the *Data Table* pattern.

## Anatomy

- **Header row** — 43px strip on \`--component-table-header-bg\` with 15px rounded top corners;
  bold 14px labels and a 9×14 sort arrow (brand blue when active, gray otherwise, flips for desc).
- **Filter row** — one search field per column (magnifier icon, borderless input), filtering as you type.
- **Data rows** — 43px, regular 14px text, hover tint; empty values render as "-".
- **Checkbox** — 16px, 3px radius, brand border; solid brand fill with a white check/dash when
  checked/indeterminate.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Header bg | \`--component-table-header-bg\` | \`--gray-100\` → #F6F6F6 |
| Header text | \`--color-text-primary\` | \`--gray-700\` → #364765 |
| Active sort arrow | \`--component-table-header-text\` | \`--blue-600\` → #1C4599 |
| Muted sort arrow / magnifier | \`--gray-450\` | #8D8D8D (closest to Figma's flat #A69D9D) |
| Cell bg / text | \`--component-table-cell-bg\` / \`-text\` | white / \`--gray-700\` |
| Borders | \`--component-table-border\` | \`--gray-300\` → #E2DBDB |
| Row hover & selected | \`--component-table-row-hover\` | \`--lightblue-100\` → #E4EDFF |
| Checkbox border | \`--color-border-brand\` | \`--blue-600\` → #1C4599 |
| Checkbox checked | \`--component-checkbox-checked-bg\` / \`-check-mark\` | \`--blue-600\` / white |
| Top corner radius | \`--radius-lg\` | 15px |
| Cell padding / gaps | \`--space-9\` / \`--space-5\` | 20px / 10px |
| Header / cell type | \`--component-table-header-fontSize\` + bold / \`--component-table-cell-fontSize\` | 14/19 |

## Accessibility

- Semantic \`<table>\`/\`<th>\` markup; sorted columns expose \`aria-sort\`.
- Headers sort via real \`<button>\`s; filter inputs and checkboxes carry \`aria-label\`s
  ("Search IP Address", "Select all rows", "Select row 3").
- Selection and sort state are visible beyond color (check mark, arrow direction).

## Usage

- **Do** provide \`rowKey\` whenever rows can reorder or page — index identity breaks selection.
- **Do** pass \`value\` next to \`render\` so custom columns keep sorting/filtering.
- **Don't** use client-side sort/filter on large server-paged datasets — control \`sort\`/\`filters\`
  and feed them to your query layer.
- **Don't** put a second interactive element inside the first column's cells; the checkbox owns it.
`;

interface Server {
  id: string;
  name: string;
  ip: string;
  components: string;
  other?: string;
}

const SERVERS: Server[] = [
  { id: 'ldsp1', name: 'DE10016.LDSP1.com', ip: '192.168.30.180', components: 'Active Directory/Exchange Server/Group Policy:' },
  { id: 'ldsp2', name: 'DE10016.LDSP2.com', ip: '192.168.30.92', components: 'Active Directory/Exchange Server/Group Policy:' },
  { id: 'ldsp3', name: 'DE10016.LDSP2.com', ip: '192.168.30.92', components: 'Active Directory/Exchange Server/Group Policy:' },
  { id: 'ldsp4', name: 'DE10016.LDSP2.com', ip: '192.168.30.92', components: 'Active Directory/Exchange Server/Group Policy:' },
];

const COLUMNS: TableColumn<Server>[] = [
  { key: 'name', header: 'Name Here', width: 279 },
  { key: 'ip', header: 'IP Address', width: 329 },
  { key: 'components', header: 'Component(s) to install', width: 392 },
  { key: 'other', header: 'Other', width: 300 },
];

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      description: 'Column definitions: `key`, `header`, optional `width`, `sortable`, `filterable`, `align`, `render`, `value`.',
      table: { type: { summary: 'TableColumn<T>[]' } },
    },
    data: {
      description: 'Row data. Sorted/filtered client-side unless `sort`/`filters` are controlled.',
      table: { type: { summary: 'T[]' } },
    },
    rowKey: {
      description: 'Stable row identity for selection (defaults to row index).',
      table: { type: { summary: '(row, index) => string | number' } },
    },
    selectable: {
      control: 'boolean',
      description: 'Render selection checkboxes inside the first column.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    filterRow: {
      control: 'boolean',
      description: 'Show the per-column search row under the header.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    emptyMessage: {
      control: 'text',
      description: 'Shown in a full-width cell when no rows survive filtering.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: "'No matching records'" } },
    },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=7-959',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Table<Server>>;

export const Default: Story = {
  args: {
    columns: COLUMNS,
    data: SERVERS,
    rowKey: (row: Server) => row.id,
    selectable: true,
    defaultSort: { columnKey: 'name', direction: 'asc' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma frame verbatim: four columns (279/329/392/300), checkbox selection in the first column, the search row, and "Name Here" actively sorted (blue arrow). Type in a search field or click a header to see filtering and sorting work.',
      },
    },
  },
};

export const PlainTable: Story = {
  name: 'Plain (no selection / filter row)',
  args: {
    columns: COLUMNS.map((c) => ({ ...c, width: undefined })),
    data: SERVERS,
    rowKey: (row: Server) => row.id,
    filterRow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Headers stay sortable; selection and the search row are opt-in. Columns flex evenly without `width`.',
      },
    },
  },
};

export const ControlledSelection: Story = {
  name: 'Controlled selection',
  render: () => {
    const [keys, setKeys] = useState<Array<string | number>>(['ldsp2']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Table
          columns={COLUMNS}
          data={SERVERS}
          rowKey={(row) => row.id}
          selectable
          selectedKeys={keys}
          onSelectionChange={setKeys}
        />
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Selected: {keys.length ? keys.join(', ') : 'none'}
        </span>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selection driven from outside via `selectedKeys` + `onSelectionChange`. The header checkbox shows the indeterminate dash while only some rows are selected.',
      },
    },
  },
};

export const CustomCells: Story = {
  name: 'Custom cells',
  render: () => (
    <Table<Server & { status: string }>
      columns={[
        { key: 'name', header: 'Server' },
        { key: 'ip', header: 'IP Address', width: 200 },
        {
          key: 'status',
          header: 'Status',
          width: 160,
          render: (row) => (
            <Badge variant={row.status === 'Healthy' ? 'success' : 'warning'}>{row.status}</Badge>
          ),
        },
        {
          key: 'actions',
          header: 'Actions',
          width: 140,
          sortable: false,
          filterable: false,
          render: () => <Button variant="secondary" size="sm">View</Button>,
        },
      ]}
      data={SERVERS.map((s, i) => ({ ...s, status: i % 2 ? 'Degraded' : 'Healthy' }))}
      rowKey={(row) => row.id}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compose other components into cells with `render` — here **Badge** for status and a secondary **Button** action column with sorting/filtering switched off.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    columns: COLUMNS,
    data: [],
    emptyMessage: 'No servers found',
  },
  parameters: {
    docs: {
      description: { story: 'With no surviving rows the body collapses to a single full-width message cell.' },
    },
  },
};
