import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FolderTree } from './FolderTree';
import type { FolderTreeFolder } from './FolderTree.types';
import { SearchIcon } from '../../icons';

const componentDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

Expandable report folders matching the Figma "Report Sidebar" frame (node 186:4535).

## Overview

\`FolderTree\` lists report folders — brand-blue plus, yellow folder, 16px label — and clicking a
row (or its plus) flips the plus to a minus and reveals the folder's reports underneath, each
with the scroll/file icon from the Figma "Inside menu" variant. Reports are selectable
(\`onItemSelect\` + \`selectedItemId\`), and expansion works uncontrolled (\`defaultExpandedIds\`)
or controlled (\`expandedIds\` + \`onExpandedChange\`).

Pass \`filter\` to wire a search field above the tree: non-matching folders and reports are
hidden, and folders containing matching reports auto-expand.

## Anatomy

- **Folder row** — one \`<button aria-expanded>\` per folder: 24px plus/minus in
  \`--color-border-brand\`, 40px yellow folder (#FFCA28, illustrative — no token), body-lg label
  in \`--component-card-title-text\`, hover tint, brand focus ring.
- **Report rows** — revealed underneath, indented so the scroll icon aligns under the folder;
  selected report gets \`--color-brand-light\` background and brand text.
- **Empty folder** — expanding a folder with no reports shows a quiet "No reports" line.

## Accessibility

- Folder rows are real buttons with \`aria-expanded\`; reports are buttons with \`aria-current\`
  on the selected one — everything is keyboard reachable in DOM order.
- The whole folder row toggles (not just the 24px plus), keeping the hit target large.
- Filtering announces nothing by itself — pair the search input with \`aria-controls\` and a
  results count for screen readers in product code.

## Usage

- **Do** keep folder labels short ("Active Directory", "File Server") — one line each.
- **Do** use \`onItemSelect\` to load the report and mark it via \`selectedItemId\`.
- **Don't** nest folders inside folders — the design is a two-level tree (folders → reports).
`;

const FOLDERS: FolderTreeFolder[] = [
  {
    id: 'all',
    label: 'All Reports',
    items: [
      { id: 'all-1', label: 'Permission Changes' },
      { id: 'all-2', label: 'Failed Logons' },
      { id: 'all-3', label: 'Account Lockouts' },
    ],
  },
  {
    id: 'ad',
    label: 'Active Directory',
    items: [
      { id: 'ad-1', label: 'User Modifications' },
      { id: 'ad-2', label: 'Group Membership Changes' },
      { id: 'ad-3', label: 'OU Changes' },
    ],
  },
  {
    id: 'exchange',
    label: 'Exchange Server',
    items: [
      { id: 'ex-1', label: 'Mailbox Permission Changes' },
      { id: 'ex-2', label: 'Non-Owner Mailbox Access' },
    ],
  },
  { id: 'exchange-online', label: 'Exchange Server Online', items: [] },
  {
    id: 'gpo',
    label: 'Group Policy',
    items: [{ id: 'gpo-1', label: 'GPO Setting Changes' }],
  },
  {
    id: 'fs',
    label: 'File Server',
    items: [
      { id: 'fs-1', label: 'File Read Events' },
      { id: 'fs-2', label: 'File Permission Changes' },
    ],
  },
];

const meta: Meta<typeof FolderTree> = {
  title: 'Navigation/Folder Tree',
  component: FolderTree,
  tags: ['autodocs'],
  argTypes: {
    folders: {
      description: 'Folders with their reports (`id`, `label`, `items`).',
      table: { type: { summary: 'FolderTreeFolder[]' } },
    },
    expandedIds: { description: 'Controlled expanded folder ids.', table: { type: { summary: 'string[]' } } },
    defaultExpandedIds: { description: 'Uncontrolled initial expanded folders.', table: { type: { summary: 'string[]' } } },
    onExpandedChange: { table: { type: { summary: '(ids: string[]) => void' } } },
    selectedItemId: { control: 'text', description: 'Highlight one report as active.' },
    onItemSelect: { table: { type: { summary: '(itemId, folderId) => void' } } },
    filter: { control: 'text', description: 'Hide non-matching folders/reports; auto-expand matches.' },
  },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=186-4535',
    },
    docs: { description: { component: componentDescription } },
  },
};

export default meta;
type Story = StoryObj<typeof FolderTree>;

export const Default: Story = {
  args: { folders: FOLDERS },
  decorators: [(StoryFn) => <div style={{ width: 372 }}><StoryFn /></div>],
  parameters: {
    docs: {
      description: {
        story: 'Click any folder row (or its plus) to reveal the reports underneath; click again to collapse.',
      },
    },
  },
};

export const Expanded: Story = {
  name: 'Expanded with selection',
  args: {
    folders: FOLDERS,
    defaultExpandedIds: ['ad'],
    selectedItemId: 'ad-2',
  },
  decorators: [(StoryFn) => <div style={{ width: 372 }}><StoryFn /></div>],
  parameters: {
    docs: {
      description: {
        story: 'Active Directory pre-expanded with "Group Membership Changes" selected — brand-light background, brand text.',
      },
    },
  },
};

export const ReportSidebar: Story = {
  name: 'Report sidebar (Figma frame)',
  render: () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string | undefined>();
    return (
      <div
        style={{
          width: 372,
          padding: '24px 16px 24px 24px',
          borderRight: '1px solid var(--component-card-border, #c7c7c7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p
          style={{
            margin: '0 0 14px',
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--typography-nav-fontSize, 14px)',
            fontWeight: 600,
            color: 'var(--color-icon-default, #0a1959)',
          }}
        >
          Auditor - Report
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 40,
            padding: '0 14px',
            border: '1px solid var(--color-border-default, #c7c7c7)',
            borderRadius: 'var(--radius-6xl, 30px)',
            background: 'var(--color-background-surface, #fff)',
            marginBottom: 10,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports"
            aria-label="Search reports"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'none',
              fontFamily: 'var(--font-family-primary)',
              fontSize: 16,
              color: 'var(--color-text-brand, #1c4599)',
            }}
          />
          <SearchIcon size={16} style={{ color: 'var(--color-text-secondary)' }} />
        </div>
        <FolderTree
          folders={FOLDERS}
          filter={search}
          selectedItemId={selected}
          onItemSelect={(id) => setSelected(id)}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The full Figma composition: "Auditor - Report" heading, the rounded search field driving `filter` (folders with matching reports auto-expand), and selectable reports.',
      },
    },
  },
};
