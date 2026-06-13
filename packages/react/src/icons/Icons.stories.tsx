import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../components/TextField';
import { iconRegistry, SearchIcon, type IconName } from './index';

const ICON_COUNT = Object.keys(iconRegistry).length;

const meta: Meta = {
  title: 'Foundations/Icons',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=2092-127',
    },
    docs: {
      description: {
        component: `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The consolidated Lepidus icon library — ${ICON_COUNT} icons exported from the Figma icon
library (node 2092:127, file Ck7BIRlRw2bwHRk8PL5IfC).

## Overview

Every icon is exported from the Figma library and generated into a React component by
\`scripts/build-icons.mjs\`. Monochrome icons have their \`#364765\` strokes/fills mapped to
\`currentColor\`, so they inherit the CSS \`color\` of their context (set it with a color
token such as \`var(--color-text-primary)\`). Multicolor brand icons (alert triangles, file
type marks, product logos) keep their original fills.

## Usage

\`\`\`tsx
import { SearchIcon } from '@ramsarjal-404/react/icons';

// Decorative (default): aria-hidden="true", sized via the size prop (default 24)
<SearchIcon size={16} />

// Meaningful: opt out of aria-hidden and label it
<SearchIcon aria-hidden={false} aria-label="Search" role="img" />
\`\`\`

All icons accept \`{ size?: number } & SVGProps<SVGSVGElement>\`; props spread onto the root
\`<svg>\`. The \`iconRegistry\` map exposes every icon by name (\`IconName\`) for dynamic
lookups.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const names = Object.keys(iconRegistry).sort((a, b) => a.localeCompare(b)) as IconName[];

const GalleryGrid = () => {
  const [query, setQuery] = useState('');
  const filtered = names.filter((n) => n.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div>
      <div style={{ marginBottom: 16, maxWidth: 320 }}>
        <TextField
          placeholder={`Search ${names.length} icons…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search icons"
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 12,
        }}
      >
        {filtered.map((name) => {
          const Icon = iconRegistry[name];
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '14px 6px',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-background-surface)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Icon size={24} />
              <code
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                }}
              >
                {name}
              </code>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
            No icons match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
};

export const Gallery: Story = {
  render: () => <GalleryGrid />,
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 24,
        color: 'var(--color-text-primary)',
      }}
    >
      {[16, 24, 32, 48].map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <SearchIcon size={size} />
          <code style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{size}px</code>
        </div>
      ))}
    </div>
  ),
};

export const TokenTinting: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {[
        ['--color-text-primary', 'text-primary'],
        ['--color-text-brand', 'text-brand'],
        ['--color-status-error-text', 'status-error-text'],
      ].map(([token, label]) => (
        <div
          key={token}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: `var(${token})`,
          }}
        >
          <SearchIcon size={32} />
          <code style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{label}</code>
        </div>
      ))}
    </div>
  ),
};
