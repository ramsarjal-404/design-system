import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Visibility — when `false` the modal renders nothing at all.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    title: {
      control: 'text',
      description:
        'Header title shown in the white, brand-colored header bar (`typography/nav`, semibold). Omit to hide the header entirely.',
      table: { type: { summary: 'ReactNode' } },
    },
    headerAlign: {
      control: 'inline-radio',
      options: ['center', 'left'],
      description: 'Title alignment inside the header bar — `center` matches the Figma instance.',
      table: { type: { summary: "'center' | 'left'" }, defaultValue: { summary: "'center'" } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Width preset — sm (520px), md (680px), lg (743px, the Figma frame width).',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: "'md'" } },
    },
    overlay: {
      control: 'boolean',
      description:
        'Render the dimmed fixed backdrop and center the shell on screen. Set `false` to embed the shell inline (used by the docs canvas).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    onClose: {
      control: false,
      description:
        'Close handler — fired by the backdrop click, the Escape key, and the secondary action when it has no `onClick` of its own.',
      table: { type: { summary: '() => void' } },
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Call `onClose` when the backdrop is clicked (only applies while `overlay` is true).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Call `onClose` when the Escape key is pressed (only applies while `overlay` is true).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    fields: {
      control: false,
      description:
        'Declarative list of input rows rendered in the body. Each entry supports every Lepidus `Input` prop plus an optional stable `key`; labels are laid out in an auto-sized grid column.',
      table: { type: { summary: 'ModalField[]' } },
    },
    children: {
      control: false,
      description: 'Custom body content, rendered after any `fields`.',
      table: { type: { summary: 'ReactNode' } },
    },
    primaryAction: {
      control: false,
      description:
        'Primary (filled) footer action: `{ label: string; onClick?: () => void; disabled?: boolean }`.',
      table: { type: { summary: 'ModalAction' } },
    },
    secondaryAction: {
      control: false,
      description:
        'Secondary (outline) footer action — when it has no `onClick`, it falls back to firing `onClose`.',
      table: { type: { summary: 'ModalAction' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=658-10178',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Popup / dialog surface with a brand-titled header, declarative input rows and a centered action footer — bound to Figma node **658:10178 "URL Popup"**.

## Overview

\`Modal\` is the Lepidus dialog for **focused, short data-entry tasks**: entering a URL, renaming an item, supplying credentials. It composes the Lepidus \`Input\` (via the \`fields\` array) and \`Button\` (via \`primaryAction\` / \`secondaryAction\`) on a tinted shell with a white header bar, and traps the user's attention behind a dimmed backdrop.

Do **not** use Modal merely to show status or alerts — use **Message** (large alert surface with action buttons) for blocking feedback, or **Toast** (node 4:356, compact transient notification pill) for passive notifications. Prefer inline forms over a Modal when the task is long or multi-step.

## Anatomy

- **Backdrop** — fixed, 50% \`component/modal/overlay\` dim; click-to-close (configurable). Omitted when \`overlay={false}\`.
- **Shell** — tinted (\`color/background/page\`) rounded card with the card shadow; width set by \`size\`.
- **Header bar** — white strip with the brand-blue title, center- or left-aligned.
- **Body** — optional \`fields\` grid (auto-sized label column + full-width Inputs) followed by custom \`children\`.
- **Footer** — centered secondary (outline) + primary (filled) Lepidus \`Button\`s.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Backdrop | \`--component-modal-overlay\` @ 50% | rgba(0,0,0,.5) |
| Shell tint | \`--color-background-page\` | #F5F7FD |
| Shell radius | \`--radius-input\` | 25px |
| Shell shadow | \`--shadow-card-*\` | 0 2px 9px rgba(0,0,0,.1) |
| Header bg | \`--component-modal-bg\` | #FFFFFF |
| Title | \`--color-text-brand\` + \`typography/nav\` | #1C4599, 14/19 semibold |
| Header padding | \`--space-21\` / \`--space-9\` | 17px / 20px |
| Header↔body gap | \`--space-13\` | 48px |
| Field label | \`--component-input-label\` | #555766 |
| Field row gaps | \`--space-7\` (col) / \`--space-9\` (row) | 15px / 20px |
| Footer button gap | \`--space-7\` | 15px |

## States & variants

- \`size="sm" | "md" | "lg"\` — 520 / 680 / 743px shell widths (lg matches Figma).
- \`headerAlign="center" | "left"\` — title placement; omit \`title\` to drop the header bar.
- \`overlay\` — modal-over-backdrop vs inline embedded shell.
- Field states — each \`fields\` row accepts the full Input API, including \`status="error"\` + \`errorMessage\` and \`helperText\`.
- Action states — \`primaryAction\` / \`secondaryAction\` each support \`disabled\`.

## Accessibility

- The shell renders \`role="dialog"\` with \`aria-modal="true"\` while the overlay is shown, and \`aria-labelledby\` pointing at the title (id generated with \`useId\`).
- Escape closes the dialog (\`closeOnEsc\`, overlay mode only); clicking the backdrop closes it too (\`closeOnOverlayClick\`). Both call your \`onClose\`.
- Every field row renders a real \`<label htmlFor>\` bound to its Input id.
- The secondary action defaults to \`onClose\`, so "Cancel" works without extra wiring.
- Focus is managed automatically in overlay mode: on open, focus moves to the first focusable element in the dialog; Tab and Shift+Tab cycle within it; on close, focus returns to the element that opened it.

## Usage

- **Do** keep modals to one short task; prefer \`fields\` over hand-rolled inputs so labels and spacing stay aligned.
- **Do** give the primary action a verb label ("Done", "Save", "Rename"), with Cancel as the secondary.
- **Do** render the Modal conditionally (\`open\`) so focus restore can find the trigger that opened it.
- **Don't** disable both \`closeOnEsc\` and \`closeOnOverlayClick\` unless data loss is at stake — always leave an obvious way out.
- **Don't** use a Modal for pure status text — that is **Message** or **Toast** territory.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/** Faithful repro of the Figma "URL Popup" (rendered inline for the docs canvas). */
export const Default: Story = {
  args: {
    overlay: false,
    size: 'lg',
    title: 'Please Enter Site Collection URL',
    fields: [
      {
        label: 'Site Collection:',
        defaultValue: '\\\\192.14.35.335',
        helperText: 'Please enter Site collection URL',
      },
    ],
    primaryAction: { label: 'Done' },
    secondaryAction: { label: 'Cancel' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Faithful reproduction of the Figma "URL Popup" (node 658:10178), rendered inline (`overlay={false}`) so the docs canvas can show it: lg shell, one labeled field with helper text, Done/Cancel footer.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // The shell renders role="dialog", labelled by the header title.
    const dialog = canvas.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(String(args.title));

    // Inline (overlay={false}) — aria-modal is omitted on the embedded shell.
    expect(dialog).not.toHaveAttribute('aria-modal');

    // The declarative field renders a real <label> bound to the Input.
    const field = within(dialog).getByLabelText('Site Collection:');
    expect(field).toHaveValue('\\\\192.14.35.335');

    // Footer renders the secondary (Cancel) and primary (Done) actions.
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeEnabled();
    expect(within(dialog).getByRole('button', { name: 'Done' })).toBeEnabled();
  },
};

/** Multiple inputs — a credentials form built from the `fields` array. */
export const MultipleInputs: Story = {
  name: 'Multiple Inputs',
  args: {
    overlay: false,
    size: 'lg',
    title: 'Add Credentials',
    fields: [
      { label: 'Domain:', placeholder: 'mycompany.local' },
      { label: 'Username:', placeholder: 'username@domainname' },
      { label: 'Password:', type: 'password', placeholder: '••••••••' },
      { label: 'Confirm:', type: 'password', placeholder: '••••••••' },
    ],
    primaryAction: { label: 'Save' },
    secondaryAction: { label: 'Cancel' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A credentials form built declaratively from the `fields` array — the label column auto-sizes to the widest label and all inputs stay aligned.',
      },
    },
  },
};

/** A field in the error state (reuses Input's `status="error"`). */
export const WithValidation: Story = {
  name: 'With Validation Error',
  args: {
    overlay: false,
    size: 'lg',
    title: 'Please Enter Site Collection URL',
    fields: [
      {
        label: 'Site Collection:',
        defaultValue: 'not-a-valid-url',
        status: 'error',
        errorMessage: 'Enter a valid UNC path, e.g. \\\\server\\share',
      },
    ],
    primaryAction: { label: 'Done' },
    secondaryAction: { label: 'Cancel' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Field-level validation: each `fields` row supports the full Input API, here `status="error"` plus `errorMessage`.',
      },
    },
  },
};

/** Left-aligned header + medium width. */
export const LeftHeader: Story = {
  name: 'Left-aligned Header',
  args: {
    overlay: false,
    size: 'md',
    headerAlign: 'left',
    title: 'Rename Item',
    fields: [{ label: 'Name:', defaultValue: 'Q3 Permission Report' }],
    primaryAction: { label: 'Rename' },
    secondaryAction: { label: 'Cancel' },
  },
  parameters: {
    docs: {
      description: {
        story: 'The `headerAlign="left"` variant on the medium (680px) shell — for utility dialogs like renames.',
      },
    },
  },
};

/** Sizes side by side. */
export const Sizes: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All three width presets stacked: sm (520px), md (680px) and lg (743px — the Figma frame width).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Modal
          key={s}
          overlay={false}
          size={s}
          title={`Size = ${s}`}
          fields={[{ label: 'Value:', placeholder: 'Type here' }]}
          primaryAction={{ label: 'Ok' }}
          secondaryAction={{ label: 'Cancel' }}
        />
      ))}
    </div>
  ),
};

/** The real thing — a trigger button opening the modal over a dimmed backdrop. */
export const WithOverlay: Story = {
  name: 'With Overlay (interactive)',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={open}
          size="lg"
          title="Please Enter Site Collection URL"
          fields={[
            { label: 'Site Collection:', defaultValue: '\\\\192.14.35.335', helperText: 'Please enter Site collection URL' },
          ]}
          onClose={() => setOpen(false)}
          primaryAction={{ label: 'Done', onClick: () => setOpen(false) }}
          secondaryAction={{ label: 'Cancel' }}
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The production behavior: a trigger opens the modal over the dimmed backdrop. Escape, the backdrop and Cancel all fire `onClose`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Closed by default — nothing but the trigger is rendered.
    expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    const openButton = canvas.getByRole('button', { name: 'Open modal' });

    // Open: the dialog appears with aria-modal over the backdrop, and focus
    // moves to its first focusable element automatically.
    await userEvent.click(openButton);
    const dialog = await canvas.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Please Enter Site Collection URL');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    // Escape fires onClose, which the story wires to close the modal; focus
    // returns to the trigger that opened it.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(openButton).toHaveFocus());

    // Re-open, then close via Cancel — the secondary action with no onClick
    // of its own falls back to onClose.
    await userEvent.click(openButton);
    const reopened = await canvas.findByRole('dialog');
    await userEvent.click(within(reopened).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
