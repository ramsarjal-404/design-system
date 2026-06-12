import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Data Display/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    totalRecords: {
      description: 'Total number of records in the dataset, rendered as "Total Records - N".',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    currentPage: {
      description: 'Current page, 1-based. The component is fully controlled — update it from `onPageChange`.',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    totalPages: {
      description: 'Total number of pages, rendered as "/N" next to the page input and used to clamp navigation.',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    pageSize: {
      description: 'Rows shown per page; drives the "N/Page" selector label.',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    pageSizeOptions: {
      description: 'Options offered in the page-size popover.',
      control: false,
      table: { type: { summary: 'number[]' }, defaultValue: { summary: '[10, 25, 50, 100]' } },
    },
    disabled: {
      description: 'Disables the whole control — buttons, page input and page-size selector.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onPageChange: {
      description:
        'Fired with the new (clamped) page when the user presses First / Previous / Next / Last or commits the page input.',
      control: false,
      table: { type: { summary: '(page: number) => void' } },
    },
    onPageSizeChange: {
      description: 'Fired when the user picks a new page size from the popover.',
      control: false,
      table: { type: { summary: '(pageSize: number) => void' } },
    },
    className: {
      description: 'Class appended to the root navigation element.',
      control: false,
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=4-3',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Table pagination bar matching the Figma **Pagination** component (node **4:3**).

## Overview
\`Pagination\` is the navigation bar placed under data tables: a record count, First/Previous/Next/Last buttons, an editable current-page input and a rows-per-page selector. Use it whenever a table or list is split into pages. It is fully controlled — you own \`currentPage\`/\`pageSize\` and respond to the callbacks. Don't use it for step-by-step wizards (use a stepper) or for infinite-scroll feeds where no page model exists.

## Anatomy
- **Record count label** — "Total Records - N" plain text.
- **Nav buttons** — First, Previous, Next, Last: brand-filled rounded (16px) pills.
- **Page input** — bordered numeric text field showing the current page, followed by a "/N" total label.
- **Page-size selector** — "N/Page" text trigger with a chevron that opens a listbox popover of \`pageSizeOptions\`.

## Design tokens
| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Bar / input / popover background | \`--component-pagination-bg\` | \`color/background/surface\` → #ffffff |
| Labels & selector text | \`--component-pagination-text\` | \`color/text/primary\` → #364765 |
| Nav button fill | \`--component-pagination-active-bg\` | \`color/brand/primary\` → #1c4599 |
| Nav button text | \`--component-pagination-active-text\` | \`color/text/inverse\` → #ffffff |
| Disabled button border, popover border | \`--component-pagination-border\` | \`color/border/default\` → #c7c7c7 |
| Button & input border / focus ring | \`--color-border-brand\` | #1c4599 |
| Disabled fill | \`--color-button-disabled-bg\` | #c6c6c6 |
| Disabled text | \`--color-text-disabled\` | #727171 |
| Button / input radius | \`--radius-mxl\` | 16px |
| Typography | \`--typography-label-md-*\` | 12px / 16px, semibold |

## States & variants
The Figma states map onto page position and the \`disabled\` prop:
- **Right enabled** — \`currentPage === 1\`: First/Previous auto-disable, Next/Last stay active.
- **Left enabled** — \`currentPage === totalPages\`: Next/Last auto-disable, First/Previous stay active.
- **Both enabled** — any middle page: all four buttons active.
- **Disabled** — \`disabled\` greys every control regardless of page position.

## Behavior
- First/Previous/Next/Last call \`onPageChange\` with the target page; the value is clamped to \`1…totalPages\` and no event fires if the page wouldn't change.
- The page input keeps a local draft: only digits are accepted, and the draft commits (clamped) on **Enter** or blur. It re-syncs whenever \`currentPage\` changes externally.
- The page-size trigger toggles a popover; picking an option fires \`onPageSizeChange\` and closes it.
- The popover closes on outside click and **Escape** (listeners only attached while open).

## Accessibility
- Root is \`role="navigation"\` with \`aria-label="Pagination"\`.
- The page input has \`aria-label="Current page"\` and \`inputMode="numeric"\` for numeric keyboards.
- The page-size trigger exposes \`aria-haspopup="listbox"\`, \`aria-expanded\` and \`aria-label="Rows per page"\`; the popover is \`role="listbox"\` with \`role="option"\` + \`aria-selected\` items.
- All controls are native buttons/inputs with visible \`:focus-visible\` brand outlines; disabled states use the native \`disabled\` attribute.

## Usage
- **Do** reset to page 1 when the page size changes — \`totalPages\` shrinks and the old page may no longer exist.
- **Do** derive \`totalPages\` from \`totalRecords / pageSize\` in one place so the labels stay consistent.
- **Do** keep it adjacent to the table it controls so the record count reads in context.
- **Don't** preload \`pageSizeOptions\` with values your API can't serve.
- **Don't** disable individual buttons yourself — first/last-page disabling is automatic.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/** Interactive wrapper so the controls actually paginate. */
function InteractivePagination(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.currentPage ?? 1);
  const [size, setSize] = useState(args.pageSize ?? 50);
  const totalPages = Math.max(1, Math.ceil(args.totalRecords / size));
  return (
    <Pagination
      {...args}
      currentPage={Math.min(page, totalPages)}
      totalPages={totalPages}
      pageSize={size}
      onPageChange={setPage}
      onPageSizeChange={(s) => {
        setSize(s);
        setPage(1);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    totalRecords: 100,
    currentPage: 3,
    totalPages: 5,
    pageSize: 50,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive bar on a middle page — all four nav buttons enabled, page input editable, page-size popover live.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Current page');

    // The interactive wrapper derives totalPages = ceil(100 / 50) = 2 and
    // clamps currentPage 3 → 2, so the bar starts on the last page (2/2).
    expect(input).toHaveValue('2');
    expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: 'Last' })).toBeDisabled();

    // Previous decrements the page; the input re-syncs to the new page.
    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    await waitFor(() => expect(input).toHaveValue('1'));

    // On page 1, First and Previous auto-disable.
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'First' })).toBeDisabled();
      expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });
    expect(canvas.getByRole('button', { name: 'Next' })).toBeEnabled();

    // Typing an out-of-range page and pressing Enter clamps + commits it.
    await userEvent.clear(input);
    await userEvent.type(input, '9{Enter}');
    await waitFor(() => expect(input).toHaveValue('2'));

    // Back on the final page: Next / Last disable again.
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
      expect(canvas.getByRole('button', { name: 'Last' })).toBeDisabled();
    });
    expect(canvas.getByRole('button', { name: 'First' })).toBeEnabled();
  },
};

export const FirstPage: Story = {
  name: 'First page (right enabled)',
  render: (args) => <InteractivePagination {...args} />,
  args: { totalRecords: 100, currentPage: 1, totalPages: 5, pageSize: 50 },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "right enabled" state: First and Previous auto-disable on page 1 while Next and Last remain active.',
      },
    },
  },
};

export const LastPage: Story = {
  name: 'Last page (left enabled)',
  render: (args) => <InteractivePagination {...args} />,
  args: { totalRecords: 100, currentPage: 5, totalPages: 5, pageSize: 50 },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "left enabled" state: Next and Last auto-disable on the final page while First and Previous remain active.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    totalRecords: 100,
    currentPage: 1,
    totalPages: 5,
    pageSize: 50,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Whole-control disabled state — buttons, page input and page-size selector all grey out, matching the Figma "disabled" variant.',
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
          'Static gallery of the four Figma states stacked: middle page, first page (right enabled), last page (left enabled) and disabled.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* unique landmark labels — multiple nav landmarks must be distinguishable */}
      <Pagination aria-label="Pagination (middle page)" totalRecords={100} currentPage={3} totalPages={5} pageSize={50} />
      <Pagination aria-label="Pagination (first page)" totalRecords={100} currentPage={1} totalPages={5} pageSize={50} />
      <Pagination aria-label="Pagination (last page)" totalRecords={100} currentPage={5} totalPages={5} pageSize={50} />
      <Pagination aria-label="Pagination (disabled)" totalRecords={100} currentPage={1} totalPages={5} pageSize={50} disabled />
    </div>
  ),
};

export const RTL: Story = {
  name: 'RTL',
  render: (args) => (
    <div dir="rtl">
      <InteractivePagination {...args} />
    </div>
  ),
  args: {
    totalRecords: 100,
    currentPage: 3,
    totalPages: 5,
    pageSize: 50,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default interactive bar under `dir="rtl"` — check that the segments flow right-to-left, the page-size popover hangs off the trigger\'s inline-end edge, and its option labels align to the start edge.',
      },
    },
  },
};
