import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description:
        'Status variant — swaps the badge fill, pill border, gradient tail and title color (`component/status/*`; info uses the brand `component/toast/*` accents).',
      table: {
        type: { summary: "'info' | 'success' | 'warning' | 'error'" },
        defaultValue: { summary: "'info'" },
      },
    },
    title: {
      control: 'text',
      description: 'Bold heading line (e.g. "Info !"), tinted with the variant accent.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: 'text',
      description: 'Supporting one-line message rendered under the title.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: 'boolean',
      description:
        'Show the leading 52px circular badge. Pass `false` to hide it, or a React node to replace the default glyph.',
      table: {
        type: { summary: 'boolean | ReactNode' },
        defaultValue: { summary: 'true' },
      },
    },
    onClose: {
      control: false,
      description: 'When provided, renders a close (×) button wired to this handler. Omit to hide it.',
      table: { type: { summary: '() => void' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=4-356',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Compact transient notification pill with a circular status badge, title + message line and close button — bound to Figma node **4:356 "Info"**.

## Overview

\`Toast\` is the Lepidus surface for **lightweight, passive notifications**: "saved", "session expiring", "credentials failed". It is a self-contained pill that typically appears in a corner, lives for a few seconds (auto-dismiss is the host app's responsibility) and never blocks the user.

Do **not** use Toast when the user must read details or make a decision — use **Message** (node 1212:18) instead: Message is the large alert surface with a heading, multi-line body and primary/secondary action buttons. Rule of thumb: notify with Toast, interrupt with Message.

## Anatomy

- **Badge** — 52px circle filled with the variant accent, holding a white glyph (check, "i" or "!"). Hidden via \`icon={false}\` or replaced with a custom node.
- **Title** — bold 20px accent-colored heading (e.g. "Success !").
- **Message** — 14px supporting line in the body color.
- **Close button** — optional × on the trailing edge, rendered only when \`onClose\` is set.
- **Pill** — 69px-radius capsule with a 1px accent border, white→accent left-to-right gradient and a drop shadow.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Border (info) | \`--component-toast-border\` | #1C4599 |
| Gradient start | \`--component-toast-bg-from\` | #FFFFFF |
| Gradient end (info) | \`--component-toast-bg-to\` | #C6D8FF |
| Badge bg (info) | \`--component-toast-badge-bg\` | #1C4599 |
| Badge glyph | \`--component-toast-badge-text\` | #FFFFFF |
| Title (info) | \`--component-toast-title-text\` | #1C4599 |
| Message | \`--component-toast-body-text\` + \`typography/body/md\` | #364765, 14px |
| Close icon | \`--component-toast-close\` | #364765 |
| Gap / padding | \`--space-7\` / \`--space-5\` + \`--space-9\` | 15px / 10px 20px |
| Status accents | \`--color-status-{success,warning,error}-text\` / \`-bg\` | #1CAA52 / #F57F17 / #F72B2B + tinted bg |

## States & variants

- \`variant="info"\` *(default — the Figma instance)* — brand-blue \`component/toast/*\` accents, "i" glyph.
- \`variant="success"\` — accent swaps to \`color/status/success/text\` (#1CAA52) with \`success/bg\` gradient tail, check glyph.
- \`variant="warning"\` — \`color/status/warning/text\` (#F57F17) + \`warning/bg\` tail, "!" glyph.
- \`variant="error"\` — \`color/status/error/text\` (#F72B2B) + \`error/bg\` tail, "!" glyph.
- Composition states: with/without badge, with/without close button.

## Accessibility

- The root renders \`role="status"\` with \`aria-live="polite"\` — screen readers announce it without interrupting the current task (unlike Message's assertive \`role="alert"\`).
- Badge and close glyphs are \`aria-hidden\` SVGs; the meaning must be carried by the title/message text, never by color alone.
- The close control is a real \`<button type="button">\` with \`aria-label="Close"\` and a brand \`:focus-visible\` outline.
- Auto-dismiss timing is owned by the host app — allow enough time to read, and pause on hover/focus if you implement it.

## Usage

- **Do** keep copy to one short sentence; the pill is single-line by design.
- **Do** provide \`onClose\` so keyboard users can dismiss the toast before any auto-timeout.
- **Don't** put actions or links inside a Toast — if the user must act, use **Message**.
- **Don't** announce errors that block the workflow as a Toast; polite live regions are easy to miss.
- **Don't** stack many toasts at once; queue them in the host app.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Info !',
    children: 'provided credentials failed to authenticate.',
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Faithful reproduction of the Figma instance (node 4:356, "Info"): brand-blue badge, border and gradient tail.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success !',
    children: 'your changes have been saved.',
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Success variant — green status accent with a check glyph, for confirmations like saves.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning !',
    children: 'your session is about to expire.',
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning variant — orange status accent with a "!" glyph, for time-sensitive but non-blocking notices.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error !',
    children: 'provided credentials failed to authenticate.',
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Error variant — red status accent with a "!" glyph. For blocking failures that need user action, prefer the Message component.',
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
          'All four status variants side by side — the badge, border, gradient tail and title swap accents while layout tokens stay constant.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}>
      <Toast variant="info" title="Info !" onClose={() => {}}>
        provided credentials failed to authenticate.
      </Toast>
      <Toast variant="success" title="Success !" onClose={() => {}}>
        your changes have been saved.
      </Toast>
      <Toast variant="warning" title="Warning !" onClose={() => {}}>
        your session is about to expire.
      </Toast>
      <Toast variant="error" title="Error !" onClose={() => {}}>
        provided credentials failed to authenticate.
      </Toast>
    </div>
  ),
};
