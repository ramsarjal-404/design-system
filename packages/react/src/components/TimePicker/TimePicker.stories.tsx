import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Forms/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Overline label rendered above the time row.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Enter Time'" } },
    },
    defaultHour: {
      description:
        'Initial hour (1–12 in 12-hour mode, 0–23 in 24-hour mode). Defaults to 7 (12h) or 9 (24h).',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: '7 (12h) / 9 (24h)' } },
    },
    defaultMinute: {
      description: 'Initial minute (0–59).',
      control: { type: 'number', min: 0, max: 59 },
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    defaultPeriod: {
      description: 'Initial AM/PM selection (12-hour mode only).',
      control: 'inline-radio',
      options: ['AM', 'PM'],
      table: { type: { summary: "'AM' | 'PM'" }, defaultValue: { summary: "'AM'" } },
    },
    use24Hour: {
      description: 'Use a 24-hour clock — hides the AM/PM toggle and clamps hours to 0–23.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onCancel: {
      description: 'Fired when the footer Cancel text button is pressed.',
      control: false,
      table: { type: { summary: '() => void' } },
    },
    onConfirm: {
      description:
        'Fired when OK is pressed. Receives `{ hour, minute, period }`; `period` is `null` in 24-hour mode.',
      control: false,
      table: { type: { summary: '(value: TimePickerValue) => void' } },
    },
    className: {
      description: 'Class appended to the card root.',
      control: false,
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=124-505',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

"Enter Time" picker matching the Figma TimePicker frame (node **124:505**).

## Overview
\`TimePicker\` is a compact card for typing a clock time: large editable hour and minute boxes split by a colon, an AM/PM toggle in 12-hour mode, and a Cancel/OK footer. Use it when a flow needs a single standalone time entry (alarms, reminders, deadlines). For composing a full recurring schedule — date, time and recurrence together — use the sibling **Calendar**, which embeds its own H/M/S dropdowns instead.

## Anatomy
- **Overline label** — uppercase letter-spaced "ENTER TIME" caption.
- **Hour and minute boxes** — 80×64px tinted numeric inputs with "Hour" / "Minute" captions below.
- **Colon** — two stacked dots separating the boxes.
- **AM/PM toggle** — vertical bordered two-segment switch (12-hour mode only).
- **Footer** — brand clock glyph on the left, Cancel and OK text buttons on the right.

## Design tokens
| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Card background | \`--component-calendar-bg\` | \`color/background/surface\` → #ffffff |
| Card radius | \`--component-card-radius\` | \`radius/card\` → 15px |
| Card shadow | \`--shadow-card-*\` | 0 2px 9px rgba(0,0,0,.1) |
| Hour/minute box fill | \`--color-button-secondary-bg\` | \`blue/200\` → #c6d8ff |
| Box digits, unit labels, footer buttons | \`--color-text-brand\` | \`blue/600\` → #1c4599 |
| Colon dots | \`--color-text-dark\` | \`black\` → #000000 |
| Overline & inactive AM/PM text | \`--color-text-secondary\` | #555766 |
| AM/PM toggle border | \`--component-modal-border\` | \`color/border/default\` → #c7c7c7 |
| Box / toggle radius | \`--radius-ms\` | 9px |
| Focus ring | \`--color-border-brand\` | #1c4599 |

## States & variants
- **12-hour (default)** — \`use24Hour: false\`; AM/PM toggle visible, hours clamped to 1–12.
- **24-hour** — \`use24Hour: true\`; toggle hidden, hours clamped to 0–23, \`period\` reported as \`null\`.
- **AM / PM** — \`aria-pressed\` toggle segments; the active one gets the tinted fill and brand text.
- **Focused box** — brand border plus soft brand glow via \`:focus\`.

## Behavior
- Hour/minute inputs accept digits only, capped at 2 characters; non-digits are stripped as you type.
- On blur each box clamps into range (hour 1–12 or 0–23, minute 0–59) and re-pads to two digits.
- AM/PM is a simple toggle; clicking a segment selects it.
- **OK** clamps the current values and fires \`onConfirm({ hour, minute, period })\`; **Cancel** fires \`onCancel\`. State is internal (uncontrolled) and seeded by the \`default*\` props.

## Accessibility
- The card is \`role="group"\` labelled by the \`label\` text; the AM/PM toggle is a nested \`role="group"\` labelled "AM or PM".
- Inputs have explicit \`aria-label\` "Hour" / "Minute" and \`inputMode="numeric"\` for numeric keyboards.
- AM/PM segments are native buttons exposing state via \`aria-pressed\`.
- The colon and clock glyph are \`aria-hidden\`; footer buttons show visible \`:focus-visible\` brand outlines.

## Usage
- **Do** read the result only from \`onConfirm\` — intermediate keystrokes are draft state.
- **Do** match \`defaultHour\` to the mode: 1–12 for 12-hour, 0–23 when \`use24Hour\` is set.
- **Do** branch on \`period === null\` when persisting, to distinguish 24-hour values.
- **Don't** use it for durations or time ranges — it captures a single clock time.
- **Don't** pair \`defaultPeriod\` with \`use24Hour\`; the toggle is hidden and the value ignored.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

/** Faithful repro of the Figma frame (07:00 AM). */
export const Default: Story = {
  args: { defaultHour: 7, defaultMinute: 0, defaultPeriod: 'AM' },
  parameters: {
    docs: {
      description: {
        story: 'Faithful reproduction of the Figma frame (07:00 AM) — 12-hour mode with the AM segment active.',
      },
    },
  },
};

export const PM: Story = {
  args: { defaultHour: 9, defaultMinute: 30, defaultPeriod: 'PM' },
  parameters: {
    docs: {
      description: {
        story: 'Afternoon time (09:30 PM) showing the PM segment of the toggle in its active tinted state.',
      },
    },
  },
};

export const TwentyFourHour: Story = {
  name: '24-Hour',
  args: { use24Hour: true, defaultHour: 18, defaultMinute: 45 },
  parameters: {
    docs: {
      description: {
        story:
          '24-hour mode (`use24Hour`): the AM/PM toggle is hidden, hours clamp to 0–23 and `onConfirm` reports `period: null`.',
      },
    },
  },
};
