import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description:
        'Schedule frequency — controls which extra selectors appear: `daily` (grid + time), `weekly` (+ weekday chips), `monthly` (+ weekday and date chips).',
      control: 'inline-radio',
      options: ['daily', 'weekly', 'monthly'],
      table: { type: { summary: "'daily' | 'weekly' | 'monthly'" }, defaultValue: { summary: "'daily'" } },
    },
    title: {
      description: 'Heading text in the white card header. Defaults to "<Variant> Schedule".',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'<Variant> Schedule'" } },
    },
    defaultMonth: {
      description: 'Initial month shown in the grid (0–11). Defaults to the current month.',
      control: { type: 'number', min: 0, max: 11 },
      table: { type: { summary: 'number' }, defaultValue: { summary: 'current month' } },
    },
    defaultYear: {
      description: 'Initial year shown in the grid. Defaults to the current year.',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'current year' } },
    },
    defaultSelectedDate: {
      description: 'Initially selected day of month (1–31).',
      control: { type: 'number', min: 1, max: 31 },
      table: { type: { summary: 'number' } },
    },
    yearRange: {
      description: 'First/last year offered in the year dropdown, as offsets relative to today.',
      control: false,
      table: { type: { summary: '[number, number]' }, defaultValue: { summary: '[-5, 5]' } },
    },
    markedDates: {
      description: 'Days of the shown month (1–31) to mark with a brand-blue event dot.',
      control: 'object',
      table: { type: { summary: 'number[]' } },
    },
    onSelectDate: {
      description: 'Fired when the user picks a day in the grid. Receives `{ year, month, day }`.',
      control: false,
      table: { type: { summary: '(date: { year; month; day }) => void' } },
    },
    onCancel: {
      description: 'Fired when the footer Cancel button is pressed.',
      control: false,
      table: { type: { summary: '() => void' } },
    },
    onDone: {
      description:
        'Fired when the footer Done button is pressed. Receives the full `CalendarValue` (year, month, day, time, weekdays, dates).',
      control: false,
      table: { type: { summary: '(value: CalendarValue) => void' } },
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
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=124-734',
    },
    docs: {
      description: {
        component: `![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Schedule picker matching the Figma Calendar frames (nodes **124:734 / 124:906 / 124:1088**).

## Overview
\`Calendar\` is a titled scheduling card: a Start-On month/year picker, an interactive month grid, a Start-At H/M/S time picker and — depending on frequency — weekday and date multi-selects, closed by Cancel/Done. Use it inside scheduling flows (e.g. configuring a recurring job) where the user composes a full schedule in one card. For picking just a clock time, prefer the sibling **TimePicker**; for selecting list values, prefer **Dropdown** — this component is a composite scheduler, not a generic date input.

## Anatomy
- **Header** — white bar with the bold "<Variant> Schedule" title.
- **Start On row** — two brand-filled Month and Year dropdowns with leading calendar glyphs.
- **Month grid** — 7-column grid of circular day cells; today is ring-outlined, the selection is tinted, event days show a dot.
- **Start At row** — three white bordered H / M / S dropdown pills.
- **Select Month / Select Date rows** — chip multi-select fields (weekly/monthly only); selected values render as removable blue chips (round chips for dates).
- **Footer** — Cancel (secondary) and Done (primary) system **Button**s.

## Design tokens
| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Card shell | \`--color-background-page\` | \`lightblue/50\` → #f5f7fd |
| Card radius | \`--component-card-radius\` | \`radius/card\` → 15px |
| Header / panels / fields | \`--component-modal-bg\` | \`color/background/surface\` → #ffffff |
| Field & panel borders | \`--component-modal-border\` | \`color/border/default\` → #c7c7c7 |
| Day text | \`--component-calendar-day-text\` | \`color/text/primary\` → #364765 |
| Today ring | \`--component-calendar-today-border\` | \`color/border/brand\` → #1c4599 |
| Disabled day | \`--component-calendar-disabled-text\` | \`color/text/disabled\` → #727171 |
| Brand dropdown fill | \`--color-brand-primary\` | \`blue/600\` → #1c4599 |
| Selected day / chips / hovers | \`--color-button-secondary-bg\` | \`blue/200\` → #c6d8ff |
| Row labels & chip text | \`--color-text-brand\` | \`blue/600\` → #1c4599 |
| Field placeholder | \`--component-input-placeholder\` | \`color/text/disabled\` → #727171 |

## States & variants
The three Figma frames map onto \`variant\`:
- **\`daily\`** (124:734) — Start On + month grid + Start At + footer.
- **\`weekly\`** (124:906) — adds the "Select Month" weekday chip multi-select.
- **\`monthly\`** (124:1088) — adds both the weekday chips and the "Select Date" round-chip grid (1–31).
- Day-cell states: default, hover tint, **today** (brand ring + bold), **selected** (tinted + bold), disabled grey.

## Behavior
- Month/Year dropdowns re-render the grid for the chosen month; the year list spans \`yearRange\` offsets around the current year.
- Clicking a day selects it (single selection) and fires \`onSelectDate\`; days in \`markedDates\` carry an event dot.
- All dropdowns and the chip popovers close on outside click; the dropdowns also close on **Escape**.
- Chip fields toggle values: clicking a popover option or a chip itself adds/removes it; selections stay sorted.
- H/M/S selections are kept as internal state and reported only through \`onDone\`.
- **Done** fires \`onDone\` with the entire \`CalendarValue\`; **Cancel** fires \`onCancel\`. Neither clears internal state.
- All selection state (date, time, weekdays, dates) is internal/uncontrolled; seed it via the \`default*\` props.

## Accessibility
- The card is \`role="dialog"\` labelled by the heading text.
- Month/Year/H/M/S triggers expose \`aria-haspopup="listbox"\` + \`aria-expanded\`; their panels are \`role="listbox"\` with \`role="option"\` + \`aria-selected\` items.
- The grid is \`role="grid"\` labelled "<Month> <Year>"; day buttons use \`aria-pressed\` for selection and event dots have \`aria-label="has event"\`.
- Chip fields are keyboard-operable (\`role="button"\`, \`tabIndex=0\`, Enter/Space toggle, Escape closes) and each chip has a "Remove <label>" label.
- Day cells and footer buttons show visible \`:focus-visible\` brand outlines.

## Usage
- **Do** pick the lightest variant that fits the schedule: \`daily\` unless weekday or date recurrence is genuinely needed.
- **Do** read the final selection from \`onDone\` — intermediate time/weekday changes are intentionally not surfaced.
- **Do** pass \`markedDates\` to flag days that already have scheduled events.
- **Don't** use it as a general date-of-birth or range picker; it models a recurring schedule.
- **Don't** wrap it in another dialog role — the card already announces itself as a dialog.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Daily: Story = {
  args: { variant: 'daily', defaultMonth: 0, defaultYear: 2025, defaultSelectedDate: 15 },
  parameters: {
    docs: {
      description: {
        story:
          'Daily schedule (Figma 124:734): month/year picker, day grid and H/M/S time row — no recurrence selectors.',
      },
    },
  },
};

export const Weekly: Story = {
  args: { variant: 'weekly', defaultMonth: 0, defaultYear: 2026, defaultSelectedDate: 15, markedDates: [8, 14, 19, 30] },
  parameters: {
    docs: {
      description: {
        story:
          'Weekly schedule (Figma 124:906): adds the weekday chip multi-select. Also demonstrates `markedDates` event dots.',
      },
    },
  },
};

export const Monthly: Story = {
  args: { variant: 'monthly', defaultMonth: 0, defaultYear: 2026, defaultSelectedDate: 15 },
  parameters: {
    docs: {
      description: {
        story:
          'Monthly schedule (Figma 124:1088): adds both the weekday chips and the round date chips (1–31) for date-of-month recurrence.',
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
        story: 'The three frequency variants side by side — daily, weekly and monthly.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Calendar variant="daily" defaultMonth={0} defaultYear={2025} defaultSelectedDate={15} />
      <Calendar variant="weekly" defaultMonth={0} defaultYear={2026} defaultSelectedDate={15} />
      <Calendar variant="monthly" defaultMonth={0} defaultYear={2026} defaultSelectedDate={15} />
    </div>
  ),
};
