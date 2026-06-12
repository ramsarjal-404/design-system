import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

App-level manager for the **Toast** pill (Figma node 4:356) — the Toast component itself is
unchanged; this provider adds the stacking, timing and queueing behavior its docs delegate to
the host app. There is no dedicated Figma frame for the stack itself.

## Overview

Wrap your application once in \`ToastProvider\`, then fire notifications imperatively from any
descendant with the \`useToast()\` hook:

\`\`\`tsx
const { toast, dismiss } = useToast();
const id = toast({ variant: 'success', title: 'Saved !', message: 'Report exported.' });
// dismiss(id) — programmatic dismissal, e.g. when the related task is superseded
\`\`\`

Toasts stack in the **top-right corner**, auto-dismiss after **6000ms** (per-toast override;
\`duration: 0\` persists until closed), **pause their countdown on hover**, and show at most
**5 at once** — further toasts queue FIFO and surface as earlier ones leave.

Use this for passive, transient feedback. For blocking feedback with actions, use **Message**;
for a single static inline status, render \`<Toast>\` directly.

## Anatomy

- **Viewport** — fixed top-right region (\`z/toast\` layer, \`space/9\` inset, \`space/4\` gap)
  rendered through the \`Portal\` primitive; a single polite live region.
- **Slot** — wraps each \`Toast\` pill with its enter/exit animation and hover-pause handlers.
- **Toast** — the existing Lepidus pill, receiving \`variant\`/\`title\`/\`message\`/\`icon\` from
  \`toast(...)\` plus an \`onClose\` wired to \`dismiss\`.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Layer | \`--z-toast\` | 1600 |
| Stack gap | \`--space-4\` | 8px |
| Viewport inset | \`--space-9\` | 20px |
| Enter motion | \`--duration-base\` + \`--easing-decelerate\` | 180ms slide-in |
| Exit motion | \`--duration-base\` + \`--easing-accelerate\` | 180ms fade-out |
| Pill surface | \`component/toast/*\` (see Toast docs) | — |

## States & variants

- Pass-through \`variant="info" | "success" | "warning" | "error"\` per toast.
- **Timed** *(default)* — auto-dismisses after \`duration\` ms, countdown paused while hovered.
- **Persistent** — \`duration: 0\`; stays until the close button or \`dismiss(id)\`.
- **Queued** — beyond \`max\` visible, toasts wait invisibly and keep their full duration.
- **Exiting** — fade/slide-out before removal; skipped under reduced motion.

## Accessibility

- All toasts render inside **one polite live region** (\`aria-live="polite"\`,
  \`role="region"\` labelled "Notifications") — announcements never interrupt the user's
  current task, and the region is a navigable landmark.
- Every toast gets a close button (\`dismiss\`) so keyboard users can dismiss before the
  timeout; hovering pauses the countdown for slow readers.
- Enter/exit animations are disabled under \`prefers-reduced-motion: reduce\` (removal is
  then immediate).
- Keep messages self-contained text — actions and links belong in **Message**, not here.

## Usage

- **Do** mount exactly one \`ToastProvider\` near the app root; \`useToast()\` throws if no
  provider is found.
- **Do** keep the default 6000ms unless copy is unusually long; never auto-dismiss faster
  than a user can read.
- **Don't** render your own \`<Toast>\` inside the stack — go through \`toast(...)\` so
  queueing and live-region semantics stay intact.
- **Don't** fire a toast for every keystroke-level event; batch or debounce noisy sources.
`;

/** Demo trigger row — lives inside the provider so it can call useToast(). */
function DemoButtons() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button
        variant="primary"
        onClick={() =>
          toast({ variant: 'info', title: 'Info !', message: 'A new agent version is available.' })
        }
      >
        Info
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          toast({ variant: 'success', title: 'Success !', message: 'Report exported to PDF.' })
        }
      >
        Success
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          toast({ variant: 'warning', title: 'Warning !', message: 'Session expires in 5 minutes.' })
        }
      >
        Warning
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({ variant: 'error', title: 'Error !', message: 'Provided credentials failed to authenticate.' })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: 'info',
            title: 'Persistent',
            message: 'Stays until you close it (duration: 0).',
            duration: 0,
          })
        }
      >
        Persistent
      </Button>
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: 'Feedback/Toast Provider',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Application subtree that gains access to the `useToast()` hook.',
      table: { type: { summary: 'ReactNode' } },
    },
    duration: {
      control: { type: 'number', min: 0, step: 500 },
      description:
        'Default auto-dismiss timeout in ms. Each `toast({ duration })` can override it; `0` persists until dismissed.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6000' } },
    },
    max: {
      control: { type: 'number', min: 1, step: 1 },
      description:
        'Maximum number of toasts visible at once — further toasts queue FIFO and surface as earlier ones leave.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=4-356',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const LiveDemo: Story = {
  name: 'Live Demo',
  render: (args) => (
    <ToastProvider {...args}>
      <DemoButtons />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fire each variant into the shared top-right stack. Hover a toast to pause its 6s countdown; fire more than five to watch the queue drain in order; "Persistent" stays until closed.',
      },
    },
  },
};

export const AutoDismiss: Story = {
  // fires and removes a toast on a timer — no stable frame to snapshot
  tags: ['no-vrt'],
  name: 'Auto-dismiss (play test)',
  args: { duration: 800 },
  render: (args) => (
    <ToastProvider {...args}>
      <DemoButtons />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Regression test: firing a toast surfaces a `role="status"` pill inside the polite live region, and it auto-dismisses after the (shortened, 800ms) duration without user input.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Nothing announced yet.
    expect(body.queryByRole('status')).not.toBeInTheDocument();

    // Fire a toast → the pill (role="status") appears in the portal stack,
    // inside the single polite live region.
    await userEvent.click(canvas.getByRole('button', { name: 'Success' }));
    const status = await body.findByRole('status');
    expect(status).toHaveTextContent('Report exported to PDF.');
    const region = body.getByRole('region', { name: 'Notifications' });
    expect(region).toContainElement(status);

    // Auto-dismiss: with duration=800 the toast leaves on its own.
    await waitFor(() => expect(body.queryByRole('status')).not.toBeInTheDocument(), {
      timeout: 3000,
    });
  },
};
