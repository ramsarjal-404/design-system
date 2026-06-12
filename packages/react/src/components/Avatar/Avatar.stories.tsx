import type { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor, within } from '@storybook/test';
import { Avatar, AvatarGroup } from './Avatar';

const PORTRAIT =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" fill="#1c4599"/><circle cx="28" cy="22" r="9" fill="#e4edff"/><path d="M10 50c2-10 9-15 18-15s16 5 18 15z" fill="#e4edff"/></svg>`
  );

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description:
        'Image URL. While it loads (and if it fails) the initials fallback renders, so layout never jumps.',
      table: { type: { summary: 'string' } },
    },
    alt: {
      control: 'text',
      description:
        'Accessible name for the image. Falls back to `name` when omitted; pass `alt=""` only for purely decorative avatars duplicated by adjacent text.',
      table: { type: { summary: 'string' } },
    },
    name: {
      control: 'text',
      description:
        'Display name — drives the initials (first + last word, max 2 chars), the deterministic background (hashed onto `--color-chart-series-1…6`) and the fallback accessible name.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Avatar diameter: `sm` 24px, `md` 32px, `lg` 40px, `xl` 56px.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
      },
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
      description:
        '`circle` uses `--radius-avatar` (full circle); `square` uses `--radius-ms` (9px).',
      table: {
        type: { summary: "'circle' | 'square'" },
        defaultValue: { summary: "'circle'" },
      },
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'away', 'offline'],
      description:
        'Presence dot in the bottom-right corner with an `aria-label` ("Online" / "Away" / "Offline"). Colors: success-text green, chart-yellow, text-disabled gray.',
      table: { type: { summary: "'online' | 'away' | 'offline'" } },
    },
    className: {
      control: false,
      description: 'Extra class names merged onto the root `<span>`.',
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

Identity thumbnail of the Lepidus design system. *No dedicated Figma frame yet — built token-first; add the frame and node link when designed.*

## Overview

Avatar represents a person (or entity) as an image with a guaranteed graceful fallback: when \`src\` is missing or fails to load, it renders up to two initials derived from \`name\` on a background deterministically hashed from the name onto the six chart-series tokens — the same person always gets the same color. Use **AvatarGroup** to stack collaborators with an overlap and a "+N" overflow chip.

Avatar is non-interactive. To make it clickable, wrap it in a **Button** or a **Link** — don't attach click handlers directly. For status text ("Online") next to a name, prefer a **Badge** with a dot; the Avatar \`status\` dot is for compact presence on the thumbnail itself.

## Anatomy

- **Container** — inline \`<span>\`, 24/32/40/56px square, circle (\`--radius-avatar\`) or square (\`--radius-ms\`)
- **Image** — \`<img>\` with \`object-fit: cover\`, inherits the container radius
- **Initials fallback** — \`role="img"\` span, 1–2 uppercase characters, Open Sans Semibold, \`--color-text-inverse\` on a chart-series background
- **Status dot** (optional) — bottom-right circle, 2px surface ring, \`aria-label\`
- **Group** — \`role="group"\` flex row, −8px overlap, 2px surface ring per item, "+N" chip

## Design tokens

| Part | CSS variable | Resolves to |
| --- | --- | --- |
| Fallback bg 1–6 | \`--color-chart-series-1…6\` | \`#f94144\` / \`#f9c74f\` / \`#1aa367\` / \`#1c4599\` / \`#0072c3\` / \`#7096d1\` (light) |
| Fallback text | \`--color-text-inverse\` | \`--white\` \`#ffffff\` |
| Circle radius | \`--radius-avatar\` | \`--radius-circle\` \`9999px\` |
| Square radius | \`--radius-ms\` | \`9px\` |
| sm / lg sizes | \`--space-10\` / \`--space-12\` | \`24px\` / \`40px\` (32/56px have no token) |
| Initials size | \`--font-size-11/12/14/20\` + \`--font-weight-semibold\` | 11–20px / 600 |
| Status online | \`--color-status-success-text\` | \`--green-400\` \`#1caa52\` |
| Status away | \`--chart-yellow\` | \`#f9c74f\` |
| Status offline | \`--color-text-disabled\` | \`--gray-500\` \`#727171\` |
| Dot / group ring | \`--color-background-surface\` | \`--white\` \`#ffffff\` |
| Overflow chip | \`--color-background-subtle\` / \`--color-text-secondary\` / \`--color-border-default\` | \`#f6f6f6\` / \`#555766\` / \`#c7c7c7\` |

## States & variants

- **Image** — \`src\` loaded successfully
- **Initials** — no \`src\`, or the image errored (automatic, no prop needed)
- **Sizes** — \`sm | md | lg | xl\`
- **Shapes** — \`circle | square\`
- **Status** — \`online | away | offline\` dot overlay
- **Group** — overlapping stack, optional \`max\` with "+N" chip

## Accessibility

- The image carries the accessible name via \`alt\` (falls back to \`name\`); the initials fallback exposes \`role="img"\` with \`aria-label\` so screen readers announce the person either way.
- The initials characters themselves are \`aria-hidden\` — the label is the name, not "AL".
- The status dot has \`role="img"\` and an explicit \`aria-label\` ("Online" / "Away" / "Offline"); never rely on the dot color alone in surrounding copy.
- AvatarGroup renders \`role="group"\`; give it an \`aria-label\` (e.g. "Contributors") when the context isn't obvious. The "+N" chip is labelled "N more".
- Not focusable and no keyboard behavior — wrap in an interactive component for actions.

## Usage

- **Do** always pass \`name\`, even with \`src\` — it powers the fallback and the accessible name.
- **Do** keep one size per context (e.g. \`sm\` in tables, \`lg\` in page headers).
- **Don't** hand-pick fallback colors — the hash keeps colors stable and consistent across the product.
- **Don't** use the status dot as the only carrier of presence information.
- **Don't** stack more than ~5 visible avatars — set \`max\` and let the "+N" chip summarize.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Image: Story = {
  args: { src: PORTRAIT, alt: 'Ada Lovelace', name: 'Ada Lovelace', size: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'Image avatar — the `<img>` covers the container (`object-fit: cover`) and inherits its radius. `alt` provides the accessible name.',
      },
    },
  },
};

export const Initials: Story = {
  args: { name: 'Grace Hopper', size: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'No `src` → initials fallback. "Grace Hopper" → "GH" on the chart-series background its name hashes to, with `--color-text-inverse` text. The same name always yields the same color.',
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The four sizes — sm 24px, md 32px, lg 40px, xl 56px — in both shapes. Initials scale with the container (11/12/14/20px).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" size="md" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="Ada Lovelace" size="xl" />
      <Avatar name="Ada Lovelace" size="xl" shape="square" />
    </div>
  ),
};

export const WithStatus: Story = {
  name: 'With Status',
  args: { name: 'Mary Jackson', size: 'lg', status: 'online' },
  parameters: {
    docs: {
      description: {
        story:
          'Presence dot pinned bottom-right with a 2px surface ring. `online` → success green, `away` → chart yellow, `offline` → disabled gray; each carries an `aria-label`.',
      },
    },
  },
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'AvatarGroup stacks avatars with a −8px overlap and a 2px surface ring per item. `max={3}` collapses the remainder into a "+N" chip labelled "N more".',
      },
    },
  },
  render: () => (
    <AvatarGroup max={3} size="lg" aria-label="Contributors">
      <Avatar name="Ada Lovelace" />
      <Avatar src={PORTRAIT} alt="Grace Hopper" name="Grace Hopper" />
      <Avatar name="Mary Jackson" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Dorothy Vaughan" />
    </AvatarGroup>
  ),
};

export const AllStates: Story = {
  name: '✦ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Every variant at a glance: image vs. initials, all sizes, both shapes, the three status dots, deterministic hash colors, and the group stack with overflow.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Row title="Image / initials fallback">
        <Avatar src={PORTRAIT} alt="Ada Lovelace" name="Ada Lovelace" size="lg" />
        <Avatar src="/broken-portrait.jpg" name="Ada Lovelace" size="lg" />
        <Avatar name="Grace Hopper" size="lg" />
        <Avatar name="Cher" size="lg" />
      </Row>
      <Row title="Sizes">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Ada Lovelace" size="md" />
        <Avatar name="Ada Lovelace" size="lg" />
        <Avatar name="Ada Lovelace" size="xl" />
      </Row>
      <Row title="Shapes">
        <Avatar name="Mary Jackson" size="lg" shape="circle" />
        <Avatar name="Mary Jackson" size="lg" shape="square" />
        <Avatar src={PORTRAIT} alt="Grace Hopper" size="lg" shape="square" />
      </Row>
      <Row title="Status">
        <Avatar name="Ada Lovelace" size="lg" status="online" />
        <Avatar name="Grace Hopper" size="lg" status="away" />
        <Avatar name="Mary Jackson" size="lg" status="offline" />
      </Row>
      <Row title="Deterministic hash colors">
        <Avatar name="Alan Turing" size="md" />
        <Avatar name="Edsger Dijkstra" size="md" />
        <Avatar name="Barbara Liskov" size="md" />
        <Avatar name="Donald Knuth" size="md" />
        <Avatar name="Margaret Hamilton" size="md" />
        <Avatar name="John von Neumann" size="md" />
      </Row>
      <Row title="Group with overflow">
        <AvatarGroup max={3} size="md" aria-label="Contributors">
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Mary Jackson" />
          <Avatar name="Katherine Johnson" />
          <Avatar name="Dorothy Vaughan" />
        </AvatarGroup>
      </Row>
    </div>
  ),
};

export const FallbackBehavior: Story = {
  name: 'Fallback Behavior (play)',
  args: { src: '/definitely-broken.jpg', alt: 'Ada Lovelace', name: 'Ada Lovelace', size: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'Interaction test: a broken `src` triggers `onError` and the avatar swaps to the initials fallback, keeping the accessible name from `alt`/`name`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The broken image errors → initials fallback renders with the accessible name.
    await waitFor(() => {
      expect(canvas.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
    });

    // No <img> remains in the tree once the fallback kicks in.
    expect(canvasElement.querySelector('img')).toBeNull();
  },
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#555766', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}
