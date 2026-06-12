import { useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../components/Table';
import type { TableColumn } from '../components/Table';
import { Toggle } from '../components/Toggle';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { Sidebar } from '../components/Sidebar';
import {
  LepideAiIcon,
  AuditorIcon,
  TrustIcon,
  DetectIcon,
  ProtectIcon,
  IdentifyIcon,
  MyLepideIcon,
  DashboardIcon,
  LepideLogo,
} from '../components/Sidebar/lepideIcons';
import { ActionItem } from '../components/ActionItem';
import { DeleteIcon, ShareIcon } from '../components/ActionItem/actionIcons';
import { FolderTree } from '../components/FolderTree';
import { SearchIcon } from '../icons';

const patternDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The Audit Report section matching the Design Essentials page
([node 3:725](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=3-725)):
two white panels on the app canvas — a collapsible folder panel driving a wide report **Table** —
with working share/delete row actions, per-row **Toggle**s, folder management **Button**s and
live **Pagination**. Every state on the page is functional.

## Composition & behavior

- **Folder panel** (left, white surface) — "Auditor - Report" heading, the rounded search field
  (drives FolderTree's \`filter\`: non-matching folders/reports hide, matches auto-expand), and
  the **FolderTree** component: a brand plus beside each yellow folder. **Clicking a folder opens
  it** — the plus flips to a minus, its reports list underneath with the file icon, and the table
  filters to that folder ("All Reports" shows everything). Clicking a report highlights it and
  opens its folder in the table.
- **Collapse control** — the round arrow on the panel divider collapses/expands the folder panel,
  flipping its chevron (the frame's circular arrow at the panel boundary).
- **Header actions** — **Remove Folder** (secondary; enabled while a folder other than
  All Reports is open, deletes it and its reports), **Create Folder** (secondary; appends a
  folder) and **Create Report** (primary; adds a Custom report to the open folder).
- **Report table** — the **Table** component: sortable "Report Name", per-column search row,
  Description, Shared with / Shared By, **My Lepide** as a live **Toggle** per row, Report Type
  and Added By.
- **Action column** — the brand-blue kebab (⋮) opens a popover containing **ActionItem** with the
  Figma action set: **Share** (brand, appends a recipient to "Shared with") and **Delete**
  (danger, removes the report). Closes on outside click and on action.
- **Pagination** — centered under the table per the frame; genuinely slices the filtered rows,
  resets when the folder or a deletion changes the result set.

## Anatomy → token bindings

| Part | Binding (Figma → code) |
| --- | --- |
| Panels | \`--color-background-surface\` white on the \`--color-background-subtle\` canvas, \`--radius-xl\` 20px outer corners, \`--color-border-strong\` divider |
| Heading | h5 bold \`--typography-heading-h5-*\` in \`--color-icon-default\` #0A1959 |
| Search field | 40px, \`--radius-6xl\` 30px, \`--color-border-default\` border, body-lg \`--color-text-brand\` text |
| Folder tree | the **FolderTree** component: brand plus/minus, #FFCA28 folder (tokenless), body-lg labels, selected report → \`--color-brand-light\` + \`--color-text-brand\` |
| Collapse circle | \`--color-background-surface\` on \`--color-border-brand\` chevron, soft shadow |
| Table | \`--component-table-*\` chain: \`--gray-100\` header, \`--gray-300\` borders, 43px rows |
| Toggle | \`--component-toggle-*\` (brand on, \`--blue-200\` off track) |
| Kebab + menu | \`--color-text-brand\` dots; menu on \`--color-background-surface\`, \`--radius-m\`, \`--color-border-default\` border |
| Share/Delete | **ActionItem** tones: \`--color-text-brand\` / \`--color-text-danger\` |
| Buttons / Pagination / Sidebar | their own component tokens, unchanged |

## Accessibility

- The kebab is a real button with \`aria-haspopup="menu"\` / \`aria-expanded\`; the popover is a
  \`role="menu"\` wrapping ActionItem's labeled, tooltipped icon buttons.
- The collapse control is a labeled button with \`aria-expanded\`; folder rows are buttons with
  \`aria-current\` on the open folder; checkboxes and toggles carry per-item labels.
- Deleting is immediate here for demo purposes — in product, confirm destructive actions with
  **Modal** first.

## Usage

- **Do** drive the table from the folder selection in page state; the Table stays presentational.
- **Do** reuse this composition for any "browse a tree, act on rows" surface — the pieces are
  all stock components.
- **Don't** put more than Share/Delete in the kebab; if an entity needs more verbs, promote
  them to a detail page.
`;

/* ---------- data ---------- */

const INITIAL_FOLDERS = [
  'All Reports',
  'All Environment Changes',
  'Active Directory',
  'Exchange Server',
  'Exchange Server Online',
  'Group Policy',
  'File Server',
  'SharePoint Online',
  'SharePoint Server',
  'Azure AD',
  'MS Teams',
  'OneDrive',
  'Dropbox',
  'SQL Server',
  'EMC Isilion',
];

interface Report {
  id: string;
  name: string;
  folder: string;
  description: string;
  sharedWith: string[];
  sharedBy: string;
  myLepide: boolean;
  type: 'Predefined' | 'Custom';
  addedBy: string;
}

const PEOPLE = ['Danny Murphy', 'Kristin Watson', 'Albert Flores', 'Bessie Cooper', 'Richard William'];

const seedReports = (): Report[] =>
  [
    ['All Environment Changes (All Environment)', 'All Environment Changes'],
    ['All Object Changes (Active Directory)', 'Active Directory'],
    ['Failed Logons (Active Directory)', 'Active Directory'],
    ['All Successful Authentication (Active Directory)', 'Active Directory'],
    ['Concurrent Logons (Active Directory)', 'Active Directory'],
    ['User Logged on to multiple Computers (Active..)', 'Active Directory'],
    ['Admin Group Changes (Active Directory)', 'Active Directory'],
    ['Security Group Changes (Active Directory)', 'Active Directory'],
    ['User Password Reset and Change Attempts (Ac..)', 'Active Directory'],
    ['Schema Changes (Active Directory)', 'Active Directory'],
    ['Permission Changes (Active Directory)', 'Active Directory'],
    ['All Exchange Online Changes (Exchange Server O..)', 'Exchange Server Online'],
    ['Email Configuration Changes (Exchange Online)', 'Exchange Server Online'],
    ['Mailbox Permission Changes (Exchange Online)', 'Exchange Server Online'],
    ['User License Assignments (Microsoft 365)', 'Azure AD'],
    ['SharePoint Site Changes (SharePoint Online)', 'SharePoint Online'],
  ].map(([name, folder], i) => ({
    id: `r${i}`,
    name,
    folder,
    description: 'Shows all changes on all..',
    sharedWith: [PEOPLE[i % PEOPLE.length]],
    sharedBy: PEOPLE[(i + 2) % PEOPLE.length],
    myLepide: i % 3 === 0,
    type: 'Predefined' as const,
    addedBy: 'Lepide',
  }));

/* ---------- kebab row actions: Share / Delete in an ActionItem popover ---------- */

const KebabGlyph = () => (
  <svg width={4} height={18} viewBox="0 0 4 18" fill="currentColor" aria-hidden="true">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="9" r="2" />
    <circle cx="2" cy="16" r="2" />
  </svg>
);

const RowActions = ({ onShare, onDelete }: { onShare: () => void; onDelete: () => void }) => {
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const open = anchor !== null;
  const setOpen = (next: boolean) => { if (!next) setAnchor(null); };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAnchor(null);
    };
    const closeOnScroll = () => setAnchor(null);
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', closeOnScroll, true);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', closeOnScroll, true);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Report actions"
        onClick={(e) => {
          if (open) {
            setAnchor(null);
          } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setAnchor({ top: rect.bottom + 4, left: rect.right - 118 });
          }
        }}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '4px 10px',
          color: 'var(--color-text-brand, #1c4599)',
          borderRadius: 'var(--radius-3xs, 3px)',
        }}
      >
        <KebabGlyph />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            /* fixed so the menu escapes the Table wrapper's overflow container */
            position: 'fixed',
            top: anchor.top,
            left: anchor.left,
            zIndex: 50,
            padding: 6,
            background: 'var(--color-background-surface, #fff)',
            border: '1px solid var(--color-border-default, #c7c7c7)',
            borderRadius: 'var(--radius-m, 12px)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.12)',
          }}
        >
          <ActionItem
            aria-label="Report actions"
            actions={[
              { id: 'share', label: 'Share', icon: <ShareIcon />, onClick: () => { onShare(); setOpen(false); } },
              { id: 'delete', label: 'Delete', icon: <DeleteIcon />, tone: 'danger', onClick: () => { onDelete(); setOpen(false); } },
            ]}
          />
        </div>
      )}
    </div>
  );
};

/* ---------- the page ---------- */

const AuditReportPage = () => {
  const [reports, setReports] = useState<Report[]>(seedReports);
  const [folders, setFolders] = useState<string[]>(INITIAL_FOLDERS);
  const [selectedFolder, setSelectedFolder] = useState('All Reports');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>();
  const [folderSearch, setFolderSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const treeFolders = useMemo(
    () =>
      folders.map((folder) => ({
        id: folder,
        label: folder,
        items: reports
          .filter((r) => (folder === 'All Reports' ? true : r.folder === folder))
          .map((r) => ({ id: r.id, label: r.name })),
      })),
    [folders, reports]
  );

  const filtered = useMemo(
    () => (selectedFolder === 'All Reports' ? reports : reports.filter((r) => r.folder === selectedFolder)),
    [reports, selectedFolder]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openFolder = (folder: string) => {
    setSelectedFolder(folder);
    setPage(1);
  };

  /* Expanding a folder in the tree opens it; collapsing the open one falls back to All Reports */
  const handleExpandedChange = (next: string[]) => {
    const opened = next.find((id) => !expandedFolders.includes(id));
    setExpandedFolders(next);
    if (opened) openFolder(opened);
    else if (!next.includes(selectedFolder)) openFolder('All Reports');
  };

  const shareReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = PEOPLE.find((p) => !r.sharedWith.includes(p));
        return next ? { ...r, sharedWith: [...r.sharedWith, next] } : r;
      })
    );
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const removeOpenFolder = () => {
    if (selectedFolder === 'All Reports') return;
    setFolders((prev) => prev.filter((f) => f !== selectedFolder));
    setReports((prev) => prev.filter((r) => r.folder !== selectedFolder));
    setExpandedFolders((prev) => prev.filter((f) => f !== selectedFolder));
    setSelectedFolder('All Reports');
  };

  const createFolder = () => {
    const name = `New Folder ${folders.length - INITIAL_FOLDERS.length + 1}`;
    setFolders((prev) => [...prev, name]);
  };

  const createReport = () => {
    const folder = selectedFolder === 'All Reports' ? 'Active Directory' : selectedFolder;
    setReports((prev) => [
      ...prev,
      {
        id: `r${prev.length}-${folder}`,
        name: `New Custom Report (${folder})`,
        folder,
        description: 'Shows all changes on all..',
        sharedWith: [],
        sharedBy: '—',
        myLepide: false,
        type: 'Custom',
        addedBy: 'You',
      },
    ]);
  };

  const columns: TableColumn<Report>[] = [
    { key: 'name', header: 'Report Name', width: 280 },
    { key: 'description', header: 'Description', width: 190 },
    {
      key: 'sharedWith',
      header: 'Shared with',
      width: 170,
      value: (r) => r.sharedWith.join(', '),
      render: (r) => (r.sharedWith.length ? r.sharedWith.join(', ') : '-'),
    },
    { key: 'sharedBy', header: 'Shared By', width: 170 },
    {
      key: 'myLepide',
      header: 'My Lepide',
      width: 110,
      sortable: false,
      filterable: false,
      align: 'center',
      render: (r) => (
        <Toggle
          checked={r.myLepide}
          onChange={(on) =>
            setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, myLepide: on } : x)))
          }
          aria-label={`Add ${r.name} to My Lepide`}
        />
      ),
    },
    { key: 'type', header: 'Report Type', width: 125 },
    { key: 'addedBy', header: 'Added By', width: 105 },
    {
      key: 'action',
      header: 'Action',
      width: 75,
      sortable: false,
      filterable: false,
      align: 'center',
      render: (r) => <RowActions onShare={() => shareReport(r.id)} onDelete={() => deleteReport(r.id)} />,
    },
  ];

  return (
    <div style={{ position: 'relative', display: 'flex', fontFamily: 'var(--font-family-primary)' }}>
      {/* folder panel */}
      {!collapsed && (
        <div
          style={{
            width: 400,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '24px 20px',
            background: 'var(--color-background-surface, #fff)',
            borderRight: '1px solid var(--color-border-strong, #e2dbdb)',
            borderRadius: 'var(--radius-xl, 20px) 0 0 var(--radius-xl, 20px)',
          }}
        >
          <h2
            style={{
              margin: '0 0 10px',
              fontSize: 'var(--typography-heading-h5-fontSize, 20px)',
              lineHeight: 'var(--typography-heading-h5-lineHeight, 28px)',
              fontWeight: 700,
              color: 'var(--color-icon-default, #0a1959)',
            }}
          >
            Auditor - Report
          </h2>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px',
              border: '1px solid var(--color-border-default, #c7c7c7)',
              borderRadius: 'var(--radius-6xl, 30px)',
              background: 'var(--color-background-surface, #fff)', marginBottom: 8,
            }}
          >
            <input
              value={folderSearch}
              onChange={(e) => setFolderSearch(e.target.value)}
              placeholder="Search"
              aria-label="Search folders"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', fontFamily: 'inherit', fontSize: 16, color: 'var(--color-text-brand, #1c4599)' }}
            />
            <SearchIcon size={16} style={{ color: 'var(--color-text-secondary)' }} />
          </div>
          <FolderTree
            folders={treeFolders}
            expandedIds={expandedFolders}
            onExpandedChange={handleExpandedChange}
            selectedItemId={selectedReportId}
            onItemSelect={(itemId, folderId) => {
              setSelectedReportId(itemId);
              openFolder(folderId);
            }}
            filter={folderSearch}
          />
        </div>
      )}

      {/* collapse control on the divider */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand folder panel' : 'Collapse folder panel'}
        style={{
          position: 'absolute',
          left: collapsed ? -19 : 381,
          top: 24,
          zIndex: 5,
          width: 39,
          height: 39,
          borderRadius: '50%',
          border: '1px solid var(--color-border-strong, #e2dbdb)',
          background: 'var(--color-background-surface, #fff)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-border-brand, #1c4599)',
        }}
      >
        <svg width={9} height={14} viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
          <path d="M8 1 2 7l6 6" />
        </svg>
      </button>

      {/* report panel */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: 24,
          background: 'var(--color-background-surface, #fff)',
          borderRadius: collapsed
            ? 'var(--radius-xl, 20px)'
            : '0 var(--radius-xl, 20px) var(--radius-xl, 20px) 0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <Button variant="secondary" disabled={selectedFolder === 'All Reports'} onClick={removeOpenFolder}>
            Remove Folder
          </Button>
          <Button variant="secondary" onClick={createFolder}>Create Folder</Button>
          <Button variant="primary" onClick={createReport}>Create Report</Button>
        </div>

        <Table
          columns={columns}
          data={pageRows}
          rowKey={(r) => r.id}
          emptyMessage={`No reports in ${selectedFolder}`}
        />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            totalRecords={filtered.length}
            currentPage={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[5, 8, 10, 20]}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/Audit Report',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=3-725',
    },
    docs: { description: { component: patternDescription } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <AuditReportPage />,
};

/* ---------- full shell: the Lepide Sidebar rail + the audit page ---------- */

const FullShellPage = () => {
  const [activeKey, setActiveKey] = useState('auditor');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-subtle, #f6f6f6)' }}>
      <Sidebar
        header={<LepideLogo />}
        style={{ flexShrink: 0 }}
        items={[
          { key: 'ai', label: 'Lepide AI', icon: <LepideAiIcon /> },
          { key: 'auditor', label: 'Auditor', icon: <AuditorIcon /> },
          { key: 'trust', label: 'Trust', icon: <TrustIcon /> },
          { key: 'detect', label: 'Detect', icon: <DetectIcon /> },
          { key: 'protect', label: 'Protect', icon: <ProtectIcon /> },
          { key: 'identify', label: 'Identify', icon: <IdentifyIcon /> },
          { key: 'mylepide', label: 'My Lepide', icon: <MyLepideIcon /> },
          { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        ].map((n) => ({ ...n, active: n.key === activeKey, onClick: () => setActiveKey(n.key) }))}
      />
      <main style={{ flex: 1, minWidth: 0, padding: '12px 16px' }}>
        <AuditReportPage />
      </main>
    </div>
  );
};

export const FullShell: StoryObj = {
  name: 'Full shell (Sidebar + page)',
  render: () => <FullShellPage />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The complete frame from the Figma page: the Lepide **Sidebar** rail (Auditor active, navigation stateful) wrapping the audit section. All page interactions — folders, collapse, kebab actions, toggles, pagination — work identically inside the shell.',
      },
    },
  },
};
