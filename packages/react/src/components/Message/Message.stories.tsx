import type { Meta, StoryObj } from '@storybook/react';
import { Message } from './Message';

const meta: Meta<typeof Message> = {
  title: 'Feedback/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description:
        'Status variant — drives the leading icon glyph and its accent color (`color/status/*`, info uses brand blue).',
      table: {
        type: { summary: "'info' | 'success' | 'warning' | 'error'" },
        defaultValue: { summary: "'error'" },
      },
    },
    title: {
      control: 'text',
      description: 'Bold heading rendered as an `<h3>` in `typography/heading/h3` (24/36, bold).',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: 'text',
      description:
        'Body copy. Strings honor `\\n` line breaks (`white-space: pre-line`); React nodes are rendered as-is.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: 'boolean',
      description:
        'Show the leading 45px status glyph. Pass `false` to hide it, or a React node to replace the default glyph.',
      table: {
        type: { summary: 'boolean | ReactNode' },
        defaultValue: { summary: 'true' },
      },
    },
    primaryAction: {
      control: false,
      description:
        'Primary (filled) action rendered with the brand `Button`: `{ label: string; onClick?: () => void }`.',
      table: { type: { summary: 'MessageAction' } },
    },
    secondaryAction: {
      control: false,
      description:
        'Secondary (outline) action rendered with the secondary `Button`: `{ label: string; onClick?: () => void }`.',
      table: { type: { summary: 'MessageAction' } },
    },
    onClose: {
      control: false,
      description:
        'When provided, renders a close (×) button in the top-right corner wired to this handler. Omit to hide it.',
      table: { type: { summary: '() => void' } },
    },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=1212-18',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Large alert surface with a status icon, title, body copy and optional action buttons — bound to Figma node **1212:18 "Alert Message"**.

## Overview

\`Message\` is the Lepidus alert surface for **important, blocking or decision-requiring feedback**: failed operations with remediation steps, expiring licenses, confirmations of long-running jobs. It is a full card (status icon + heading + multi-line body + Ok/Cancel-style buttons + close) and is meant to sit inline in the page or inside a dialog flow until the user acts on it.

Do **not** use \`Message\` for lightweight, self-expiring feedback — use **Toast** (Figma node 4:356) instead: Toast is a compact transient notification pill with a one-line message and no action buttons. Rule of thumb: if the user must read and act, use Message; if you are just notifying, use Toast.

## Anatomy

- **Status icon** — 45px rounded-square badge filled with the variant accent, white glyph (triangle-exclamation, check or "i"). Hidden via \`icon={false}\` or replaced with a custom node.
- **Title** — \`<h3>\` heading in \`typography/heading/h3\`.
- **Body** — multi-line copy (\`white-space: pre-line\`, so \`\\n\` makes line breaks).
- **Actions row** — optional secondary (outline) + primary (filled) Lepidus \`Button\`s.
- **Close button** — optional × in the top-right, rendered only when \`onClose\` is set.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Surface | \`--component-modal-bg\` | #FFFFFF |
| Border | \`--component-modal-border\` | #E2DBDB |
| Radius | \`--component-modal-radius\` | 15px |
| Padding | \`--space-10\` / \`--space-9\` | 24px / 20px |
| Title | \`--component-modal-title-text\` + \`typography/heading/h3\` | #364765, 24/36 bold |
| Body | \`--component-modal-body-text\` + \`typography/body/lg\` | #555766, 16/22 regular |
| Icon tint (info) | \`--color-brand-primary\` | #1C4599 |
| Icon tint (success / warning / error) | \`--component-status-{success,warning,error}-text\` | #1CAA52 / #F57F17 / #F72B2B |
| Close icon | \`--color-text-secondary\` | #555766 |
| Focus ring | \`--color-border-brand\` | #1C4599 |

## States & variants

- \`variant="info"\` — "i" glyph tinted \`color/brand/primary\` (brand blue).
- \`variant="success"\` — check glyph tinted \`component/status/success/text\` (green).
- \`variant="warning"\` — triangle-exclamation glyph tinted \`component/status/warning/text\` (orange).
- \`variant="error"\` *(default — the Figma instance)* — triangle-exclamation glyph tinted \`component/status/error/text\` (red).
- Composition states: with/without icon, 0–2 actions, with/without close button.

## Accessibility

- The root renders \`role="alert"\` — assistive tech announces it immediately and assertively when it mounts; only use it for genuinely important content.
- Status glyphs are \`aria-hidden\` SVGs; meaning must also be conveyed by the title/body text, never by color alone.
- The close control is a real \`<button type="button">\` with \`aria-label="Close"\` and a visible \`:focus-visible\` brand outline.
- Actions reuse the Lepidus \`Button\`, so they are natively keyboard-focusable and operable with Enter/Space.
- The title is a semantic \`<h3>\` — keep the surrounding heading hierarchy in mind.

## Usage

- **Do** lead with a clear, specific title ("The network path was not found") and put remediation steps in the body.
- **Do** order actions secondary-then-primary; the primary action is the safe/expected resolution.
- **Don't** use Message for transient "saved!"-style feedback — that is **Toast**'s job.
- **Don't** stack more than two actions; move extra options behind the primary action.
- **Don't** mount low-importance persistent content with this component — \`role="alert"\` will interrupt screen-reader users.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Message>;

const SOLUTION =
  'Possible Solution :\nIf you have not provided full username (username@domainame) then try with full user name.\nMake sure you are entering correct password.\nMake sure the user has logon credentials for login into domain.';

/** Faithful repro of the Figma instance. */
export const Error: Story = {
  args: {
    variant: 'error',
    title: 'The network path was not found',
    children: SOLUTION,
    primaryAction: { label: 'Ok' },
    secondaryAction: { label: 'Cancel' },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Faithful reproduction of the Figma instance (node 1212:18): error variant with multi-line remediation copy, Ok/Cancel actions and a close button.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Backup completed',
    children: 'All 1,248 objects were backed up successfully. The next scheduled run is tonight at 2:00 AM.',
    primaryAction: { label: 'Done' },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Success variant — green check badge with a single primary action confirming a completed operation.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'License expiring soon',
    children: 'Your Lepide Data Security Platform license expires in 7 days. Renew now to avoid interruption.',
    primaryAction: { label: 'Renew' },
    secondaryAction: { label: 'Remind me later' },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning variant — orange triangle badge with a primary call to action and a deferral secondary.',
      },
    },
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'New report available',
    children: 'A new "Permission Analysis" report has been generated and is ready to view.',
    primaryAction: { label: 'View report' },
    secondaryAction: { label: 'Dismiss' },
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Info variant — brand-blue "i" badge for neutral announcements that still warrant a decision.',
      },
    },
  },
};

/** No buttons, no close — a passive inline message. */
export const TextOnly: Story = {
  name: 'Text Only',
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'This is an informational message with no actions.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal composition: no actions and no close button. Omitting `onClose` hides the × entirely.',
      },
    },
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 808 }}>
      <Message variant="error" title="The network path was not found" primaryAction={{ label: 'Ok' }} secondaryAction={{ label: 'Cancel' }} onClose={() => {}}>
        {SOLUTION}
      </Message>
      <Message variant="warning" title="License expiring soon" primaryAction={{ label: 'Renew' }} secondaryAction={{ label: 'Later' }} onClose={() => {}}>
        Your license expires in 7 days. Renew now to avoid interruption.
      </Message>
      <Message variant="success" title="Backup completed" primaryAction={{ label: 'Done' }} onClose={() => {}}>
        All 1,248 objects were backed up successfully.
      </Message>
      <Message variant="info" title="New report available" primaryAction={{ label: 'View report' }} secondaryAction={{ label: 'Dismiss' }} onClose={() => {}}>
        A new "Permission Analysis" report has been generated and is ready to view.
      </Message>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All four status variants side by side — only the icon glyph and its accent color change; surface, type and layout tokens stay constant.',
      },
    },
  },
};
