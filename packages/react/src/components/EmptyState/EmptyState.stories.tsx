import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { EmptyStateIllustration } from './EmptyStateIllustration';
import { UploadFileIllustration } from './UploadFileIllustration';
import { DragDropIllustration } from './DragDropIllustration';
import { NoRecordsIllustration } from './NoRecordsIllustration';
import { Button } from '../Button';
import { Table } from '../Table';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Empty page statement with illustration, matching the Figma frame (node 133:263).

## Overview

\`EmptyState\` fills a region that has nothing to show — an empty table, no search results,
nothing to download — with the sleeping-server line art and a brand-blue statement underneath.
The illustration ships as a single exported SVG from the Figma frame
(\`EmptyStateIllustration\`, 221×221 by default), so it scales crisply and needs no asset
hosting; swap it via the \`illustration\` slot when a context calls for different art.

Pass \`action\` when there is an obvious next step (a **Button** to create, import, or clear
filters). Keep the message specific to what is empty and why — "Sorry, No exported file to
download!" beats "No data".

## Illustration set

One illustration per **situation**, never per page — each ships as a single exported SVG from
its Figma frame:

| Illustration | Figma node | Situation |
| --- | --- | --- |
| \`EmptyStateIllustration\` (sleeping server) | 133:155 | Nothing here — no data, nothing to download |
| \`UploadFileIllustration\` (open folder) | 631:3919 | Awaiting user input — upload prompts, dropzones |
| \`DragDropIllustration\` (hand + drop target) | 631:3498 | Drag targets — "drop selected items here" panels |
| \`NoRecordsIllustration\` (server + magnifier) | Design Essentials 4:3532 | No results — a query/generation returned nothing |

Swap via the \`illustration\` prop. New situations should get a frame in the Lepidus Figma file
first (same line style), then be exported the same way.

> Note: \`DragDropIllustration\` is a 237×212 **raster** in Figma (the other two are vectors), so
> don't scale it above its native size. Ask design for a vector redraw when convenient. The
> Drag-and-Drop frame also sets its message in \`--component-card-title-text\` (#364765) while the
> other frames use brand blue — EmptyState keeps the brand-blue default for consistency until
> design reconciles the two.

## Anatomy

- **Illustration** — decorative (\`aria-hidden\`) sleeping-server art in the brand blues
  (#0075E0 line work, light blue fills), 221px by default.
- **Message** — 16/22 \`--typography-body-lg\` in \`--color-text-brand\`, centered, max 455px
  (the Figma frame width).
- **Action** (optional) — slot below the message.

## Accessibility

- The meaning lives in the message text; the illustration is hidden from assistive tech.
- When the empty state replaces async content, put it in an \`aria-live="polite"\` region so the
  outcome is announced.
- An action button in the \`action\` slot is a normal focusable Button.

## Usage

- **Do** say why it's empty and what to do next; pair with \`action\` when a next step exists.
- **Do** use it inside **Table** via \`emptyMessage\` for filtered-to-nothing results.
- **Don't** use it for loading (use **Progress**) or errors (use **Message**/**Toast**).
`;

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The statement under the illustration.',
      table: { type: { summary: 'ReactNode' } },
    },
    illustration: {
      description: 'Replace the default sleeping-server art.',
      table: { type: { summary: 'ReactNode' } },
    },
    illustrationSize: {
      control: 'number',
      description: 'Default illustration size in px (default 221).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '221' } },
    },
    action: {
      description: 'Optional call-to-action under the message.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=133-263',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { message: 'Sorry, No exported file to download!' },
  parameters: {
    docs: {
      description: { story: 'The Figma frame verbatim: sleeping-server illustration and the brand-blue statement.' },
    },
  },
};

export const WithAction: Story = {
  name: 'With action',
  args: {
    message: 'No reports have been generated yet.',
    action: <Button variant="primary">Generate Report</Button>,
  },
  parameters: {
    docs: {
      description: { story: 'When there is an obvious next step, surface it as a Button in the `action` slot.' },
    },
  },
};

export const UploadFile: Story = {
  name: 'Upload file',
  args: {
    message: 'Click here to upload your file!',
    illustration: <UploadFileIllustration size={168} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "Upload-File" frame (node 631:3920): the open-folder illustration prompting for input. Wrap the whole EmptyState in a button or dropzone to make it interactive.',
      },
    },
  },
};

export const AsDropzone: Story = {
  name: 'As upload dropzone',
  render: () => (
    <button
      type="button"
      onClick={() => {}}
      style={{
        border: '2px dashed var(--color-border-brand, #1c4599)',
        borderRadius: 'var(--radius-input, 25px)',
        background: 'var(--color-background-surface, #fff)',
        padding: 20,
        cursor: 'pointer',
        width: 420,
      }}
      aria-label="Upload a file"
    >
      <EmptyState message="Click here to upload your file!" illustration={<UploadFileIllustration size={150} />} />
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The upload empty state made actionable — the EmptyState sits inside a real button styled as a dropzone.',
      },
    },
  },
};

export const DragAndDrop: Story = {
  name: 'Drag and drop target',
  render: () => (
    <div
      style={{
        border: '2px dashed var(--color-border-default, #c7c7c7)',
        borderRadius: 'var(--radius-input, 25px)',
        background: 'var(--color-background-surface, #fff)',
        padding: 20,
        width: 420,
      }}
    >
      <EmptyState
        message="Drag and Drop Any Selected Group(s) or User(s)"
        illustration={<DragDropIllustration size={170} />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "Drag-and-Drop" frame (node 631:3501) as an empty drop panel — shown while no groups or users have been dragged in yet.',
      },
    },
  },
};

export const Gallery: Story = {
  name: '✦ Illustration gallery',
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <EmptyStateIllustration size={180} />
        <figcaption style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          EmptyStateIllustration — nothing here (no data / nothing to download)
        </figcaption>
      </figure>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <UploadFileIllustration size={180} />
        <figcaption style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          UploadFileIllustration — awaiting input (upload prompts / dropzones)
        </figcaption>
      </figure>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <DragDropIllustration size={180} />
        <figcaption style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          DragDropIllustration — drag targets ("drop selected items here")
        </figcaption>
      </figure>
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <NoRecordsIllustration size={180} />
        <figcaption style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          NoRecordsIllustration — no results (query/generation returned nothing)
        </figcaption>
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The full illustration set with the situation each one belongs to. One illustration per situation, never per page.',
      },
    },
  },
};

export const InTable: Story = {
  name: 'Inside Table',
  render: () => (
    <div style={{ width: 760 }}>
      <Table
        columns={[
          { key: 'name', header: 'Name Here' },
          { key: 'ip', header: 'IP Address' },
          { key: 'components', header: 'Component(s) to install' },
        ]}
        data={[]}
        emptyMessage={
          <EmptyState
            message="No servers match your search."
            illustrationSize={160}
            style={{ padding: 'var(--space-9, 20px) 0' }}
          />
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Composed into **Table** via `emptyMessage` — a smaller illustration suits the inline context.',
      },
    },
  },
};
