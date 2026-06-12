import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Labeled progress bar matching the Figma "Single Status" component (node 39:7).

## Overview

\`Progress\` reports the completion of a long-running task — restores, scans, imports — as a status
label above a 9px rounded track with a percentage readout. It covers the full task lifecycle in one
component: queued (\`pending\`), running (\`in-progress\`) and finished (\`completed\`), and by default
(\`status="auto"\`) flips to the green completed treatment the moment \`value\` reaches 100.

Do **not** use it for indeterminate "busy" feedback with no measurable completion — it always
renders a quantified bar. For event notifications when a task finishes, pair it with **Toast**.

## Anatomy

- **Label** — 12px semibold status line above the bar (e.g. "Restore in Progress"), tinted by state.
- **Track** — 9px, 12px-radius gray rail.
- **Fill** — rounded bar sized by \`value\` (30px minimum so tiny values stay visible), animated on change.
- **Readout** — 12px percentage to the right of the bar; replaced by an 18px clock icon when pending.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Label + readout (in-progress) | \`--component-progress-text\` | \`--cyan-600\` → #0072C3 (Figma "Cyan/Cyan 60") |
| Fill (in-progress) | \`--component-progress-fill\` | \`--cyan-500\` → #2391DC |
| Track | \`--component-progress-track\` | \`--gray-150\` → #E0E0E0 |
| Label + readout (completed) | \`--component-progress-complete-text\` | \`--color-status-success-text\` → #1CAA52 |
| Fill (completed) | \`--component-progress-complete-fill\` | \`--color-status-success-text\` → #1CAA52 |
| Label (pending) | \`--component-progress-pending-text\` | \`--color-text-disabled\` → #727171 |
| Fill (pending) | \`--component-progress-pending-fill\` | \`--color-button-disabled-bg\` → #C6C6C6 |
| Clock icon (pending) | \`--component-progress-pending-icon\` | \`--gray-450\` → #8D8D8D (Figma "Neutral/Gray 50") |
| Track/fill radius | \`--radius-m\` | 12px |
| Label / readout type | \`--typography-label-md-*\` / \`--typography-body-sm-*\` | 12/16 semibold / 12/16 regular |

## States & variants

- **In progress** (Figma "progress") — cyan label, cyan fill sized by \`value\`, "{value}%" readout.
- **Completed** (Figma "completed") — green label + full green bar + "100%"; forced when
  \`status="completed"\`, derived automatically at \`value >= 100\` with \`status="auto"\`.
- **Pending** (Figma "disabled") — gray label, full disabled-gray bar, clock icon instead of the
  percentage. Use for queued tasks that have not started.

## Accessibility

- The track renders \`role="progressbar"\` with \`aria-valuemin/max/now\` and a human-readable
  \`aria-valuetext\` ("75%", or "Pending" with \`aria-valuenow\` omitted for the indeterminate queue state).
- The label is plain visible text adjacent to the bar; associate it explicitly with
  \`aria-labelledby\` on the wrapper if multiple bars stack in one region.
- State is conveyed by text and the readout, not color alone (label copy + percentage / clock).

## Usage

- **Do** update \`value\` from real task telemetry and leave \`status="auto"\` so completion flips by itself.
- **Do** keep labels short and stateful ("Restore in Progress", "Completed").
- **Don't** use \`pending\` for failures — surface errors with **Message** or **Toast** instead.
- **Don't** hide the readout (\`showValue={false}\`) unless space is critical; the number is the
  primary progress signal.
`;

const meta: Meta<typeof Progress> = {
  title: 'Data Display/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Status label above the bar (e.g. "Restore in Progress").',
      table: { type: { summary: 'ReactNode' } },
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Completion 0–100. Clamped; ignored for `pending` (full track) and `completed` (100).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    status: {
      control: 'inline-radio',
      options: ['auto', 'in-progress', 'completed', 'pending'],
      description: 'Visual status. `auto` derives completed at value ≥ 100, in-progress otherwise.',
      table: {
        type: { summary: "'auto' | 'in-progress' | 'completed' | 'pending'" },
        defaultValue: { summary: "'auto'" },
      },
    },
    showValue: {
      control: 'boolean',
      description: 'Show the percentage readout (pending always shows the clock icon instead).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to fill the container (default fixed 274px from Figma).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=39-7',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const InProgress: Story = {
  name: 'In progress',
  args: { label: 'Restore in Progress', value: 75 },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "progress" variant — cyan label and fill (`--cyan-500/600`) with the percentage readout.',
      },
    },
  },
};

export const Completed: Story = {
  args: { label: 'Completed', value: 100 },
  parameters: {
    docs: {
      description: {
        story:
          'With status="auto" (default), reaching 100 flips to the green completed treatment automatically.',
      },
    },
  },
};

export const Pending: Story = {
  args: { label: 'Completed', status: 'pending' },
  parameters: {
    docs: {
      description: {
        story:
          'The Figma "disabled" variant for queued tasks — gray label, full disabled-gray bar, and the clock icon (`--gray-450`) replacing the percentage.',
      },
    },
  },
};

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 400);
      return () => clearInterval(t);
    }, []);
    return <Progress label={value >= 100 ? 'Completed' : 'Restore in Progress'} value={value} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Live demo of the auto status — the bar animates as value climbs and the whole component flips to green at 100%.',
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
        story: 'The three Figma variants stacked: in progress (75%), completed (100%) and pending.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 300 }}>
      <Progress label="Restore in Progress" value={75} />
      <Progress label="Completed" value={100} />
      <Progress label="Completed" status="pending" />
    </div>
  ),
};
