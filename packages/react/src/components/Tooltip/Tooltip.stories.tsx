import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { CloneIcon } from '../../icons';

const componentDescription = `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Short descriptive label shown on hover and keyboard focus. There is **no dedicated Tooltip
frame in the Lepidus Figma file yet** — the visual spec below derives from the shared
foundation tokens (\`radius/tooltip\`, \`typography/body/sm\`, \`shadow/flyout\`) and will be
bound to a node once one exists.

## Overview

\`Tooltip\` attaches a small dark text bubble to a single trigger element, appearing after a
300ms delay on hover **and** focus, and disappearing on leave, blur or Escape. It is built on
the shared \`Popover\` primitive, so it renders through a portal, tracks the trigger on
scroll/resize and flips vertically when it would leave the viewport.

Use Tooltip for **supplementary** description of a control — keyboard shortcuts, the name of
an icon-only button, a clarifying sentence. If the information is required to complete a task,
put it in visible text (Input \`helperText\`, inline copy) instead; if you need a rich anchored
surface, build on \`Popover\` directly.

## Anatomy

- **Trigger** — your own element, cloned to receive the hover/focus handlers and
  \`aria-describedby\`. No wrapper element is added around it.
- **Bubble** — \`role="tooltip"\` surface on \`color/text/primary\` with \`color/text/inverse\`
  text (inverts naturally per theme), \`radius/tooltip\` corners, \`shadow/flyout\` elevation
  and a 280px max width.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Surface | \`--color-text-primary\` | #364765 (light theme) |
| Text | \`--color-text-inverse\` | #FFFFFF (light theme) |
| Type | \`--typography-body-sm-*\` | 12px / 16px Open Sans |
| Padding | \`--space-2\` / \`--space-4\` | 4px / 8px |
| Radius | \`--radius-tooltip\` | 4px |
| Shadow | \`--shadow-flyout-*\` | 0 4px 12px rgba(0,0,0,.12) |
| Motion | \`--duration-fast\` + \`--easing-standard\` | 120ms enter fade/slide |
| Layer | \`--z-dropdown\` (via Popover) | 1000 |

## States & variants

- Hidden *(default)* → **delayed open** (300ms after pointer enter or focus) → **open** →
  closed on leave/blur/Escape or outside pointer-down.
- \`placement="top-start" | "top-end" | "bottom-start" | "bottom-end"\` — flips vertically
  automatically when out of viewport space.
- Enter transition is opacity + 4px slide, disabled under \`prefers-reduced-motion: reduce\`.

## Accessibility

- The bubble renders \`role="tooltip"\`; while open the trigger carries \`aria-describedby\`
  pointing at it (merged with any describedby the trigger already had), so screen readers
  announce the content as the control's description.
- Shows on keyboard **focus**, not just hover, and Escape dismisses it without activating
  the trigger.
- **Never put interactive content inside a tooltip** — it is \`pointer-events: none\` and
  vanishes on blur, so links/buttons inside it would be unreachable. Plain text only.
- A tooltip is a *description*, not a *name*: icon-only triggers still need \`aria-label\`.
- The trigger must be focusable/hoverable (button, link, input). Don't put tooltips on
  disabled elements — they fire no events.

## Usage

- **Do** keep content to one short phrase or sentence; the bubble caps at 280px and wraps.
- **Do** pair it with \`aria-label\` on icon-only buttons — tooltip for sighted users, label
  for the accessibility tree.
- **Don't** put required information (validation rules, errors) only in a tooltip.
- **Don't** nest buttons/links in \`content\` — use a custom \`Popover\` surface instead.
- **Don't** attach tooltips to disabled controls; wrap them or use visible helper text.
`;

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description:
        'Tooltip text. Plain (non-interactive) content only — the bubble is `pointer-events: none` and disappears on blur.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      description:
        'Single focusable/hoverable trigger element — cloned to attach handlers, ref and `aria-describedby` (no wrapper added).',
      table: { type: { summary: 'ReactElement' } },
    },
    placement: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
      description:
        'Preferred placement relative to the trigger; flips vertically when out of viewport space.',
      table: {
        type: { summary: "'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'" },
        defaultValue: { summary: "'bottom-start'" },
      },
    },
    delay: {
      control: { type: 'number', min: 0, step: 50 },
      description: 'Delay in ms before the bubble shows on hover/focus.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '300' } },
    },
    offset: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Gap in px between the trigger and the bubble.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    id: {
      control: false,
      description: 'id of the bubble element (auto-generated by default) — used in `aria-describedby`.',
      table: { type: { summary: 'string' } },
    },
    className: {
      control: false,
      description: 'Extra class on the bubble element.',
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
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Exports the current report as PDF',
    children: <Button variant="primary">Export</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A Lepidus Button as the trigger. The bubble appears 300ms after hover or focus and the trigger gains `aria-describedby` pointing at it — verified by the play test below.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Export' });

    // Closed by default: no bubble, no describedby on the trigger.
    expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-describedby');

    // Keyboard focus opens it after the 300ms delay (portal → search the body).
    trigger.focus();
    const tooltip = await body.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Exports the current report as PDF');

    // aria-describedby wiring: the trigger now points at the bubble's id.
    expect(tooltip.id).not.toBe('');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);

    // Escape dismisses without activating the trigger (focus stays on it)…
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(trigger).toHaveFocus();

    // …and after blurring, focusing again re-opens, blur hides it again.
    trigger.blur();
    trigger.focus();
    await body.findByRole('tooltip');
    trigger.blur();
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

export const Placements: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 32,
        padding: 64,
      }}
    >
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((p) => (
        <Tooltip {...args} key={p} placement={p} content={`placement="${p}"`}>
          <Button variant="secondary">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All four placements (top/bottom × start/end). Each one flips to the opposite vertical side automatically when the preferred side would overflow the viewport.',
      },
    },
  },
};

export const OnIconButton: Story = {
  name: 'On Icon Button',
  render: (args) => (
    <Tooltip {...args} content="Duplicate report">
      <Button variant="secondary" size="sm" aria-label="Duplicate report">
        <CloneIcon size={18} />
      </Button>
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The canonical use: naming an icon-only control for sighted users. The tooltip *describes*; the `aria-label` still *names* — never rely on the tooltip alone for the accessible name.',
      },
    },
  },
};

export const LongContent: Story = {
  name: 'Long Content',
  args: {
    content:
      'Scheduled exports run in the agent’s timezone. The next run is computed when the schedule is saved and re-computed after every completed run.',
    placement: 'bottom-start',
    children: <Button variant="secondary">Schedule info</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Longer copy wraps inside the 280px max width. If you find yourself writing this much, consider visible helper text instead — required information should never live only in a tooltip.',
      },
    },
  },
};
