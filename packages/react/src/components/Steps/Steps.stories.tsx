import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Steps } from './Steps';
import { Button } from '../Button';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Wizard progress indicator matching the Figma "Steps" component set
([node 736:425](https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=736-425)).

## Overview

\`Steps\` shows where the user is in a multi-step flow: completed steps are solid success-green
discs with a white check, the current step is a green ring with a green dot, upcoming steps are
gray rings, and 52px connectors turn green once crossed. The "{n} of {m}" label trails the dots
(\`showLabel\` to hide). Pass \`onStepClick\` to make completed steps clickable back-navigation.

Not to be confused with **Stepper** (the numeric input). Pair Steps with wizard footers
(Back/Next **Button**s) — the *DDC Modal* pattern shows the full composition.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Completed disc / dot / crossed connector | \`--color-status-success-text\` | #1CAA52 (the frame's \`--active\` binding) |
| Check mark | \`--color-icon-on-brand\` | white |
| Upcoming ring / connector | \`--color-border-default\` | #C7C7C7 (frame literal #B5BAC1 — no token, flagged) |
| Circle radius | \`--radius-m\` | 12px (24px circle) |
| Label | \`--font-size-18\` semibold \`--color-text-brand\` | 18px #1C4599 (frame draws Inter — reconciled to \`--font-family-primary\`) |
| Connector gaps | \`--space-3\` / \`--space-4\` | 5px / 8px |

> Note: the frame's "Step-1" variant draws its first position as a completed check before
> anything is done — treated as a design slip; the component uses standard semantics (current
> ring + dot from step 1). Flagged for the Figma source.

## Accessibility

- The root is \`role="progressbar"\` with \`aria-valuenow/min/max\` and "Step n of m"
  \`aria-valuetext\` — the dots are decorative.
- With \`onStepClick\`, completed steps become labelled buttons ("Go to step 2"); current and
  upcoming dots are never interactive.
- State is conveyed by the check/dot shapes and the text label, not color alone.

## Usage

- **Do** drive \`current\` from the same state as your wizard content and footer.
- **Do** use \`onStepClick\` only when revisiting steps is safe (saved drafts).
- **Don't** use Steps for unordered sections — that's **Tabs**.
`;

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number', description: 'Total number of steps.' },
    current: { control: 'number', description: 'Current step (1-based).' },
    showLabel: { control: 'boolean', description: 'Show the "N of M" label.', table: { defaultValue: { summary: 'true' } } },
    onStepClick: { description: 'Make completed steps clickable.', table: { type: { summary: '(step: number) => void' } } },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=736-425',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Steps>;

export const Default: Story = {
  args: { total: 7, current: 3 },
};

export const AllStates: Story = {
  name: '✦ All states (Figma set)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {Array.from({ length: 7 }, (_, i) => (
        <Steps key={i} total={7} current={i + 1} />
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'The seven Figma variants: Step-1 through Step-7.' } },
  },
};

export const Wizard: Story = {
  name: 'Wizard (live)',
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <Steps total={5} current={step} onStepClick={setStep} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Button variant="secondary" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
          <Button variant="primary" disabled={step === 5} onClick={() => setStep((s) => s + 1)}>Next</Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Wired to Back/Next — completed dots are clickable back-navigation via `onStepClick`.',
      },
    },
  },
};
