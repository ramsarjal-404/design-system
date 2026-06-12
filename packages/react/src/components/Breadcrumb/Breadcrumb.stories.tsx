import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Trail navigation matching the Figma "Bread crumb" component (node 676:1587).

## Overview

\`Breadcrumb\` shows where the user is and lets them jump back up the trail. Pass \`items\` in
order: every item except the last renders as a 14px semibold brand-blue link (anchor with
\`href\`, or button with \`onClick\` for router navigation) followed by a bold "/" separator in the
same blue; the last item is the current page — regular weight, \`--color-text-primary\`, not
interactive, marked \`aria-current="page"\`.

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Link + separator | \`--component-breadcrumb-active-text\` | \`--color-text-brand\` → #1C4599 |
| Current page | \`--color-text-primary\` | \`--gray-700\` → #364765 |
| Type | \`--typography-body-md-*\` | 14/19 (semibold links, bold "/", regular current) |
| Crumb padding | \`--space-5\` | 10px (overlapped to a single 10px gap, per the frame) |

> The generated \`--component-breadcrumb-separator\` token resolves to gray, but the frame draws
> the separator in the link blue — the component follows the frame; the token is unused until
> design reconciles it. Likewise the frame binds the current page to \`--color-text-primary\`,
> not \`--component-breadcrumb-text\`.

## Accessibility

- Semantic \`<nav aria-label="Breadcrumb">\` + \`<ol>\`; separators are \`aria-hidden\`.
- The current page is plain text with \`aria-current="page"\` — never a dead link.
- Links are real anchors when \`href\` is set (middle-click, copy-link work); buttons otherwise.

## Usage

- **Do** keep the trail to what the user actually descended (3–5 levels).
- **Do** use \`href\` wherever a routable URL exists; reserve \`onClick\`-only crumbs for wizards.
- **Don't** include the site root on every page out of habit — start where orientation begins.
- **Don't** truncate labels with CSS alone; shorten the label text itself.
`;

const ITEMS = [
  { label: 'Auditor', href: '#' },
  { label: 'Reports', href: '#' },
  { label: 'Active Directory', href: '#' },
  { label: 'Add Data Source' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Trail in order — last item is the current page.',
      table: { type: { summary: 'BreadcrumbItem[]' } },
    },
    separator: {
      control: 'text',
      description: 'Separator between crumbs.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: "'/'" } },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=676-1587',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: { items: ITEMS },
};

export const TwoLevels: Story = {
  name: 'Two levels',
  args: {
    items: [{ label: 'Reports', href: '#' }, { label: 'Permission Changes' }],
  },
};

export const ButtonCrumbs: Story = {
  name: 'Button crumbs (router)',
  args: {
    items: [
      { label: 'Setup', onClick: () => {} },
      { label: 'Data Sources', onClick: () => {} },
      { label: 'Add Data Source' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Without `href`, crumbs render as buttons — for client-side router navigation or wizard steps.',
      },
    },
  },
};
