import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion.types';

const BASIC_ITEMS: AccordionItem[] = [
  {
    id: 'shipping',
    title: 'Shipping details',
    content:
      'Orders placed before 2pm ship the same business day. Tracking numbers are emailed once the carrier picks up the parcel.',
  },
  {
    id: 'returns',
    title: 'Returns & exchanges',
    content:
      'Items can be returned within 30 days of delivery in their original packaging. Exchanges are processed as a return plus a new order.',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    content:
      'All hardware carries a 2-year limited warranty covering manufacturing defects. Accidental damage is not covered.',
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'Data Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description:
        'Ordered list of `{ id, title, content, disabled? }` items. `id` must be unique — it is the value used in `value`/`defaultValue` and in the generated DOM ids.',
      table: { type: { summary: 'AccordionItem[]' } },
    },
    mode: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description:
        '`single` (default) keeps at most one item open, closing the previous one; `multiple` lets any number stay open independently.',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" },
      },
    },
    value: {
      control: false,
      description:
        'Controlled open-item ids. When set, the accordion only changes via `onValueChange`. In `single` mode the array holds at most one id.',
      table: { type: { summary: 'string[]' } },
    },
    defaultValue: {
      control: false,
      description: 'Uncontrolled initial open-item ids.',
      table: { type: { summary: 'string[]' } },
    },
    onValueChange: {
      description: 'Called with the next open-id array on every toggle.',
      table: { type: { summary: '(value: string[]) => void' } },
    },
    headingLevel: {
      control: { type: 'number', min: 2, max: 6 },
      description:
        'Heading level (2–6) wrapping each trigger button so the accordion fits the surrounding document outline.',
      table: { type: { summary: '2 | 3 | 4 | 5 | 6' }, defaultValue: { summary: '3' } },
    },
    idPrefix: {
      control: 'text',
      description:
        'Prefix for the generated trigger/panel ids — set a unique one when rendering several accordions on a page.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'lds-accordion'" } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root `<div>`.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    },
    layout: 'padded',
    docs: {
      description: {
        component: `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Disclosure list of the Lepidus design system. *No dedicated Figma frame yet — built token-first; add the frame and node link when designed.*

## Overview

Accordion stacks sections of content behind headed triggers so users can scan titles and expand only what they need — FAQs, settings groups, long-form detail on dense pages. \`single\` mode (default) behaves like a spotlight (opening one closes the rest); \`multiple\` lets users hold several sections open for comparison. It runs uncontrolled with \`defaultValue\` or fully controlled with \`value\`/\`onValueChange\`.

Prefer **Tabs** when sections are mutually exclusive *views* of the same thing, and a plain page section when content is short enough to show outright — hiding two lines of text behind a click is friction, not focus.

## Anatomy

- **Root** — \`<div>\` with a roving-focus keydown handler; items divided by 1px borders
- **Heading** — \`<h2>\`–\`<h6>\` (via \`headingLevel\`, default \`<h3>\`), style-neutral
- **Trigger** — full-width native \`<button aria-expanded aria-controls>\` with title + chevron
- **Chevron** — 16px glyph, rotates 180° when expanded
- **Panel** — \`role="region"\` labelled by its trigger; height animates via \`grid-template-rows\` 0fr→1fr

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Dividers | \`--color-border-default\` | \`--gray-200\` \`#c7c7c7\` |
| Trigger text | \`--color-text-primary\` | \`--gray-700\` \`#364765\` |
| Trigger hover bg | \`--color-background-subtle\` | \`--gray-100\` \`#f6f6f6\` |
| Disabled text | \`--color-text-disabled\` + \`--opacity-disabled\` | \`#727171\` / \`0.5\` |
| Focus ring (inset) | \`--color-focus-ring\` | \`rgba(28, 69, 153, 0.35)\` |
| Panel text | \`--color-text-secondary\` | \`--gray-600\` \`#555766\` |
| Type | \`--typography-body-md-fontSize\` / \`-lineHeight\` + \`--font-weight-semibold\` | \`14px\` / \`19px\` / \`600\` |
| Padding | \`--space-8\` | \`16px\` |
| Motion | \`--duration-base\` + \`--easing-standard\` | \`180ms\` / \`cubic-bezier(0.2, 0, 0, 1)\` |

## States & variants

- **Collapsed / expanded** — \`aria-expanded\` flips; chevron rotates; panel height animates 0fr→1fr
- **Modes** — \`single\` (auto-close) / \`multiple\` (independent)
- **Hover** — trigger background \`--color-background-subtle\`
- **Focus-visible** — 3px inset \`--color-focus-ring\` box-shadow
- **Disabled item** — non-interactive trigger at \`--opacity-disabled\`

## Accessibility

- Follows the WAI-ARIA accordion pattern: real \`<button>\` triggers inside headings, \`aria-expanded\` + \`aria-controls\` on the trigger, \`role="region"\` + \`aria-labelledby\` on the panel.
- **Keyboard:** Enter/Space toggle (native button), ArrowDown/ArrowUp move focus between triggers (wrapping), Home/End jump to first/last.
- \`headingLevel\` keeps the document outline honest — set it to one below the section's heading.
- Collapsed panels are \`visibility: hidden\` so their content is removed from the accessibility tree and tab order.
- The height and chevron animations are disabled under \`prefers-reduced-motion: reduce\` (instant expand/collapse).

## Usage

- **Do** write trigger titles as short noun phrases users can scan ("Returns & exchanges").
- **Do** use \`multiple\` when users compare sections (specs, pricing tiers); keep \`single\` for FAQs.
- **Do** set \`headingLevel\` to match the surrounding outline.
- **Don't** nest accordions or put critical-path content (errors, primary actions) inside a collapsed panel.
- **Don't** auto-collapse on blur or hover — expansion must only change on explicit toggle.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  args: { items: BASIC_ITEMS, mode: 'single' },
  parameters: {
    docs: {
      description: {
        story:
          'Default `single` mode — opening an item closes the previously open one, and clicking an open trigger collapses it (zero items open is allowed).',
      },
    },
  },
};

export const Multiple: Story = {
  args: { items: BASIC_ITEMS, mode: 'multiple', defaultValue: ['shipping', 'returns'] },
  parameters: {
    docs: {
      description: {
        story:
          '`multiple` mode — every item toggles independently, so several panels can be open at once (here two start open via `defaultValue`).',
      },
    },
  },
};

export const DefaultOpen: Story = {
  name: 'Default Open',
  args: { items: BASIC_ITEMS, defaultValue: ['shipping'] },
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled with `defaultValue` — the shipping item starts expanded and the component manages state internally from there.',
      },
    },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully controlled: `value` + `onValueChange` lift the open state to the parent, enabling external buttons (or URL/state sync) to drive the accordion.',
      },
    },
  },
  render: function ControlledExample() {
    const [open, setOpen] = useState<string[]>(['returns']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, fontFamily: 'Open Sans, sans-serif', fontSize: 12 }}>
          <button type="button" onClick={() => setOpen(['shipping'])}>Open shipping</button>
          <button type="button" onClick={() => setOpen([])}>Collapse all</button>
          <span style={{ color: '#555766', alignSelf: 'center' }}>open: [{open.join(', ')}]</span>
        </div>
        <Accordion items={BASIC_ITEMS} value={open} onValueChange={setOpen} idPrefix="controlled-acc" />
      </div>
    );
  },
};

export const FAQExample: Story = {
  name: 'FAQ Example',
  parameters: {
    docs: {
      description: {
        story:
          'A typical FAQ: `single` mode, `headingLevel={2}` because the accordion is the page\'s top-level content, one item disabled.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        idPrefix="faq"
        headingLevel={2}
        items={[
          {
            id: 'pricing',
            title: 'How is Lepidus priced?',
            content: 'Lepidus is licensed per workspace with unlimited viewers. Editors are billed monthly; annual billing saves 20%.',
          },
          {
            id: 'trial',
            title: 'Is there a free trial?',
            content: 'Every new workspace starts with a 14-day trial of the full feature set. No credit card required.',
          },
          {
            id: 'migration',
            title: 'Can I migrate from another tool?',
            content: 'Yes — importers exist for the common suspects, and the CLI accepts DTCG token JSON directly.',
          },
          {
            id: 'sla',
            title: 'Enterprise SLA (contact sales)',
            content: 'SLA details are shared during procurement.',
            disabled: true,
          },
        ]}
      />
    </div>
  ),
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    docs: {
      description: {
        story:
          'Collapsed, expanded, and disabled items in one list — a quick visual diff of the divider/hover/disabled token bindings and the rotated chevron.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Accordion
        idPrefix="all-states"
        mode="multiple"
        defaultValue={['expanded']}
        items={[
          { id: 'collapsed', title: 'Collapsed item', content: 'Hidden until toggled.' },
          { id: 'expanded', title: 'Expanded item', content: 'This panel starts open — chevron rotated 180°, region visible.' },
          { id: 'disabled', title: 'Disabled item', content: 'Unreachable.', disabled: true },
        ]}
      />
    </div>
  ),
};

export const KeyboardAndToggle: Story = {
  name: 'Keyboard & Toggle (play)',
  args: { items: BASIC_ITEMS, mode: 'single', idPrefix: 'play-acc' },
  parameters: {
    docs: {
      description: {
        story:
          'Interaction test: clicking toggles `aria-expanded` (single mode closes the sibling), Enter/Space toggle via the native button, and ArrowDown/ArrowUp/Home/End rove focus across triggers.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shipping = canvas.getByRole('button', { name: 'Shipping details' });
    const returns = canvas.getByRole('button', { name: 'Returns & exchanges' });
    const warranty = canvas.getByRole('button', { name: 'Warranty' });

    // All collapsed initially.
    expect(shipping).toHaveAttribute('aria-expanded', 'false');

    // Click expands and exposes the labelled region.
    await userEvent.click(shipping);
    await waitFor(() => expect(shipping).toHaveAttribute('aria-expanded', 'true'));
    expect(canvas.getByRole('region', { name: 'Shipping details' })).toBeInTheDocument();

    // Single mode: opening another closes the first.
    await userEvent.click(returns);
    await waitFor(() => {
      expect(returns).toHaveAttribute('aria-expanded', 'true');
      expect(shipping).toHaveAttribute('aria-expanded', 'false');
    });

    // Keyboard toggle on the focused native button (Enter collapses).
    returns.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(returns).toHaveAttribute('aria-expanded', 'false'));

    // Arrow keys rove focus between triggers (with wrap), Home/End jump.
    await userEvent.keyboard('{ArrowDown}');
    expect(warranty).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}'); // wraps to first
    expect(shipping).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}'); // wraps back to last
    expect(warranty).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(shipping).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(warranty).toHaveFocus();

    // Space toggles the focused trigger open.
    await userEvent.keyboard(' ');
    await waitFor(() => expect(warranty).toHaveAttribute('aria-expanded', 'true'));
  },
};
