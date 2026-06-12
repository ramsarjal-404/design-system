import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import type { ComponentPropsWithoutRef } from 'react';
import { Link } from './Link';

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8h11" />
    <path d="M9 3.5 13.5 8 9 12.5" />
  </svg>
);

/** Stand-in for a client-side router link (e.g. react-router's <Link>). */
function FakeRouterLink({
  to,
  children,
  ...props
}: { to: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  return (
    <a href={to} data-router-link="true" {...props}>
      {children}
    </a>
  );
}

const meta: Meta<typeof Link> = {
  title: 'Actions/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['inline', 'standalone'],
      description:
        '`inline` is underlined and inherits the surrounding type scale (for running text); `standalone` is semibold without underline and supports a trailing `icon`.',
      table: {
        type: { summary: "'inline' | 'standalone'" },
        defaultValue: { summary: "'inline'" },
      },
    },
    external: {
      control: 'boolean',
      description:
        'Adds `target="_blank"` + `rel="noreferrer"`, a visually-hidden "(opens in new tab)" suffix, and a small decorative new-tab glyph.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description:
        'Renders a `<span aria-disabled="true">` with no `href` (not focusable), per WAI guidance for disabled links.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    icon: {
      control: false,
      description:
        'Trailing icon slot for the `standalone` variant — pass an SVG using `currentColor`. Rendered `aria-hidden`.',
      table: { type: { summary: 'ReactNode' } },
    },
    as: {
      control: false,
      description:
        "Polymorphic escape hatch: `'a'` (default) or a component such as a router `Link`. All anchor props are forwarded.",
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: "'a'" } },
    },
    href: {
      control: 'text',
      description: 'Destination URL (omitted automatically when `disabled`).',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: 'text',
      description: 'Link text (required). Must describe the destination — never "click here".',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root element.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    },
    layout: 'centered',
    docs: {
      description: {
        component: `
![Status: Beta](https://img.shields.io/badge/Status-Beta-f57f17)

Navigation anchor of the Lepidus design system. *No dedicated Figma frame yet — built token-first; add the frame and node link when designed.*

## Overview

Link navigates to another page or resource. Use \`inline\` inside running text — underlined so it's identifiable without color — and \`standalone\` for links that sit on their own (e.g. "View all", card footers), where placement carries affordance and a trailing icon can reinforce direction. The \`as\` prop swaps the underlying element for a router link without losing the system styling.

Link is for **navigation only**. If activating the element performs an action (submit, delete, toggle), use **Button** — even if it's styled like a link.

## Anatomy

- **Anchor** — \`<a>\` (or the \`as\` component; a \`<span aria-disabled>\` when disabled)
- **Label** — the link text; inherits the paragraph type scale (\`inline\`) or Body MD Semibold (\`standalone\`)
- **Trailing icon** (optional, standalone) — 14px \`aria-hidden\` slot using \`currentColor\`
- **External suffix** (optional) — visually-hidden "(opens in new tab)" + 12px decorative glyph

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Text | \`--color-text-brand\` | \`--blue-600\` \`#1c4599\` |
| Hover text | \`--color-brand-primary-hover\` | \`--blue-700\` \`#183a81\` |
| Disabled text | \`--color-text-disabled\` | \`--gray-500\` \`#727171\` |
| Focus outline | \`--color-focus-ring\` | \`rgba(28, 69, 153, 0.35)\` |
| Standalone type | \`--typography-body-md-fontSize\` / \`-lineHeight\` + \`--font-weight-semibold\` | \`14px\` / \`19px\` / \`600\` |
| Underline offset | \`--space-17\` | \`3px\` |
| Icon gap | \`--space-2\` | \`4px\` |
| Color transition | \`--duration-fast\` + \`--easing-standard\` | \`120ms\` / \`cubic-bezier(0.2, 0, 0, 1)\` |

## States & variants

- **Variants** — \`inline\` (underlined) / \`standalone\` (no underline, optional icon)
- **Hover** — text darkens to \`--color-brand-primary-hover\`; inline thickens the underline, standalone gains one
- **Focus-visible** — 2px \`--color-focus-ring\` outline with 2px offset
- **External** — new-tab behavior + screen-reader suffix + glyph
- **Disabled** — gray span, \`aria-disabled\`, not focusable

## Accessibility

- \`inline\` links keep their underline so they're distinguishable from body text without relying on color (WCAG 1.4.1).
- \`external\` appends a visually-hidden "(opens in new tab)" so the context change is announced; the glyph itself is \`aria-hidden\`.
- Disabled links follow WAI guidance: a \`<span aria-disabled="true">\` with no \`href\` — removed from the tab order rather than a focusable dead anchor.
- Focus is marked with a 2px offset outline on \`:focus-visible\` only, so mouse clicks don't flash a ring.
- The color transition is suppressed under \`prefers-reduced-motion: reduce\`.

## Usage

- **Do** write link text that describes the destination ("Billing settings"), not "click here".
- **Do** use \`external\` for any link leaving the product so users aren't surprised by a new tab.
- **Do** pass your router's link component via \`as\` for client-side navigation.
- **Don't** use Link for actions — use **Button** (\`onClick\` + no \`href\` is a button, not a link).
- **Don't** remove the underline from links inside paragraphs; that's what \`standalone\` is *not* for.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The inline variant inside a paragraph: inherits the surrounding type scale, underlined with a 3px offset; hover darkens the text and thickens the underline.',
      },
    },
  },
  render: () => (
    <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: '19px', color: '#364765', maxWidth: 420, margin: 0 }}>
      Your subscription renews on June 30. Review your{' '}
      <Link href="#billing">billing settings</Link> to change the plan or update the payment
      method before the renewal date.
    </p>
  ),
};

export const Standalone: Story = {
  args: {
    variant: 'standalone',
    href: '#all-projects',
    icon: <ArrowIcon />,
    children: 'View all projects',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standalone link — Body MD Semibold without underline (it gains one on hover), with the optional trailing icon slot inheriting `currentColor`.',
      },
    },
  },
};

export const External: Story = {
  args: {
    href: 'https://www.w3.org/WAI/ARIA/apg/',
    external: true,
    children: 'ARIA Authoring Practices',
  },
  parameters: {
    docs: {
      description: {
        story:
          'External link: `target="_blank"` + `rel="noreferrer"`, a visually-hidden "(opens in new tab)" suffix in the accessible name, and a decorative new-tab glyph.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The accessible name includes the visually-hidden suffix.
    const link = canvas.getByRole('link', {
      name: 'ARIA Authoring Practices (opens in new tab)',
    });

    // New-tab behavior with the safe rel.
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(link).toHaveAttribute('href', 'https://www.w3.org/WAI/ARIA/apg/');
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable report' },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled per WAI guidance: a `<span aria-disabled="true">` with no `href`, styled with `--color-text-disabled` and removed from the tab order.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Not a link role anymore — a span with aria-disabled and no href.
    expect(canvas.queryByRole('link')).toBeNull();
    const span = canvas.getByText('Unavailable report');
    expect(span).toHaveAttribute('aria-disabled', 'true');
    expect(span).not.toHaveAttribute('href');
  },
};

export const AsRouterLink: Story = {
  name: 'As Router Link',
  parameters: {
    docs: {
      description: {
        story:
          "The `as` escape hatch renders a custom component (here a stand-in for a router `Link`) while keeping the system styling — anchor props like `className` are forwarded; router-specific props (`to`) pass through.",
      },
    },
  },
  render: () => (
    <Link as={FakeRouterLink} {...{ to: '/dashboard' }} variant="standalone" icon={<ArrowIcon />}>
      Go to dashboard
    </Link>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Go to dashboard' });
    expect(link).toHaveAttribute('data-router-link', 'true');
    expect(link).toHaveAttribute('href', '/dashboard');
  },
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Both variants with their external and disabled treatments side by side — a quick visual diff of the brand/hover/disabled text tokens.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Row title="Inline (in text)">
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, lineHeight: '19px', color: '#364765', margin: 0 }}>
          Read the <Link href="#guide">migration guide</Link>, check the{' '}
          <Link href="https://example.com/changelog" external>changelog</Link>, or contact{' '}
          <Link disabled>support (offline)</Link>.
        </p>
      </Row>
      <Row title="Standalone">
        <Link variant="standalone" href="#all">View all projects</Link>
        <Link variant="standalone" href="#all" icon={<ArrowIcon />}>With icon</Link>
        <Link variant="standalone" href="https://example.com" external>External docs</Link>
        <Link variant="standalone" disabled icon={<ArrowIcon />}>Disabled</Link>
      </Row>
    </div>
  ),
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}
