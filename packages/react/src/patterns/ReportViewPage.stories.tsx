import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../components/Table';
import type { TableColumn } from '../components/Table';
import { Button } from '../components/Button';
import { Breadcrumb } from '../components/Breadcrumb';
import { Filter, applyFilterConditions } from '../components/Filter';
import type { FilterCondition } from '../components/Filter';
import { Pagination } from '../components/Pagination';
import { Calendar } from '../components/Calendar';
import { EmptyState, NoRecordsIllustration } from '../components/EmptyState';
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
import { DownloadIcon, FilterIcon, CalenderIcon } from '../icons';

const patternDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The Report View page matching the Design Essentials frame
([node 4:3166](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=4-3166)):
the screen a report opens into — title, filters line, **Breadcrumb**, export/filter actions, a
date-range control backed by **Calendar**, and the audit grid that starts empty with the
"No Records Found" **EmptyState** until **Generate Report** is clicked. Every state is functional.

## Composition & behavior

- **Header** — "Report name - …" heading (the frame's 34px is reconciled to the 32px
  \`--typography-heading-h1\` token), the "Filters: …" line, and the **Breadcrumb** component
  (Home / Lepide Auditor / Reports / Active Directory / All Objects Changes).
- **Actions row** — Download and Filter icon buttons; the **date-range pill**
  (\`--color-button-secondary-bg\` per the frame) opens the **Calendar** component in a popover —
  picking a day updates the range label and clears generated rows (new range, new query);
  **Generate Report** (primary) fills the table.
- **Empty → generated** — before generation the **Table** shows the \`NoRecordsIllustration\`
  EmptyState ("Please click on the Generate Report button to view data"); Generate Report swaps
  in the audit rows and centered **Pagination** appears, slicing them for real.
- **Table** — 9 audit columns (Server Name, Object Path, Object Class, Who modified, When,
  Operation, What, Where, From) with sortable headers and the per-column search row.
- **Modify Filters drawer**
  ([node 369:6362](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=369-6362)) —
  the Filter icon opens the right-hand drawer: brand header, a **Dropdown** of report fields,
  and **Condition** opening the criteria card ("Filter by {field}" on \`--color-brand-light\`,
  a criteria **Dropdown** (Equals / Not Equals / Contains), a search field that narrows the
  value checkboxes, and Apply disabled until a value is checked — all three Figma states).
  Applied conditions render as \`--color-button-secondary-bg\` cards with an edit pencil that
  reopens their criteria. The footer **Apply** updates the page's "Filters:" line and actually
  filters the generated rows (pagination re-slices); Cancel discards the draft.

## Anatomy → token bindings

| Part | Binding (Figma → code) |
| --- | --- |
| Canvas / panel | \`--color-background-subtle\` canvas, \`--color-background-surface\` table panel |
| Title | h1 bold \`--typography-heading-h1-fontSize\` 32 in \`--color-text-brand\` (frame literal 34 — flagged) |
| Filters line | 14/19 semibold \`--color-text-primary\` |
| Breadcrumb | the **Breadcrumb** component tokens (\`--component-breadcrumb-active-text\`) |
| Icon actions | 34px hit area, \`--color-text-brand\` glyphs from the icon set |
| Date pill | \`--color-button-secondary-bg\` #C6D8FF, \`--color-border-brand\`, \`--radius-6xl\` 30px, bold 14 brand |
| Table / Pagination | their component token chains, unchanged |
| Empty state | **EmptyState** + \`NoRecordsIllustration\` (#186ECA line art), body-lg brand message |

## Accessibility

- The date pill is a button with \`aria-haspopup="dialog"\`/\`aria-expanded\`; the Calendar popover
  closes on outside click, Cancel, and Done.
- Icon actions carry \`aria-label\`s; the empty state announces via the table's \`aria-live\`-able
  region in product code.

## Usage

- **Do** clear generated rows whenever the query inputs (date range, filters) change — stale
  results behind new filters are worse than the empty state.
- **Do** reuse this composition for every report type; only columns and the mock query differ.
- **Don't** auto-generate on load for heavy reports — the explicit Generate keeps query cost
  visible, exactly as the frame intends.
`;

/* ---------- data ---------- */

interface AuditRow {
  id: string;
  serverName: string;
  objectPath: string;
  objectClass: string;
  whoModified: string;
  when: string;
  operation: string;
  what: string;
  where: string;
  from: string;
}

const OPERATIONS = ['Modified', 'Created', 'Deleted', 'Renamed'];
const PEOPLE = ['LPDE\\administrator', 'LPDE\\d.murphy', 'LPDE\\k.watson', 'LPDE\\a.flores'];

const generateRows = (): AuditRow[] =>
  Array.from({ length: 23 }, (_, i) => ({
    id: `row-${i}`,
    serverName: `DE10016.LDSP${(i % 3) + 1}.com`,
    objectPath: `lpde.com/Users/Object-${String(i + 1).padStart(2, '0')}`,
    objectClass: i % 2 ? 'user' : 'group',
    whoModified: PEOPLE[i % PEOPLE.length],
    when: `11/28/2025 ${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')} AM`,
    operation: OPERATIONS[i % OPERATIONS.length],
    what: i % 2 ? 'Description' : 'Member',
    where: `DE10016.LDSP${(i % 3) + 1}.com`,
    from: `192.168.30.${100 + i}`,
  }));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ChevronDown = () => (
  <svg width={12} height={8} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m1 1.5 5 5 5-5" />
  </svg>
);

/* ---------- date-range pill + Calendar popover ---------- */

const DateRangeControl = ({ label, onPick }: { label: string; onPick: (label: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          height: 41,
          padding: '10px 25px',
          background: 'var(--color-button-secondary-bg, #c6d8ff)',
          border: '1px solid var(--color-border-brand, #1c4599)',
          borderRadius: 'var(--radius-6xl, 30px)',
          color: 'var(--color-text-brand, #1c4599)',
          fontFamily: 'var(--font-family-primary)',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <CalenderIcon size={24} />
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 30 }}>
          <Calendar
            title="Report Range"
            onCancel={() => setOpen(false)}
            onSelectDate={({ year, month, day }) => {
              const d = `${MONTHS[month]} ${day}, ${year}`;
              onPick(`${d} -  ${d}`);
            }}
            onDone={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

/* ---------- filter wiring ---------- */

const FIELD_KEYS: Record<string, keyof AuditRow> = {
  'Server Name': 'serverName',
  'Object Path': 'objectPath',
  'Object Class': 'objectClass',
  'Who Modified': 'whoModified',
  Operation: 'operation',
  Where: 'where',
  From: 'from',
};

const FILTER_FIELDS = Object.keys(FIELD_KEYS).map((label) => ({
  id: label,
  values: [...new Set(generateRows().map((r) => String(r[FIELD_KEYS[label]])))],
}));

/* ---------- the page ---------- */

const COLUMNS: TableColumn<AuditRow>[] = [
  { key: 'serverName', header: 'Server Name', width: 190 },
  { key: 'objectPath', header: 'Object Path', width: 230 },
  { key: 'objectClass', header: 'Object Class', width: 130 },
  { key: 'whoModified', header: 'Who modified', width: 180 },
  { key: 'when', header: 'When', width: 175 },
  { key: 'operation', header: 'Operation', width: 120 },
  { key: 'what', header: 'What', width: 110 },
  { key: 'where', header: 'Where', width: 180 },
  { key: 'from', header: 'From' },
];

const ReportViewPage = () => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [generated, setGenerated] = useState(false);
  const [dateLabel, setDateLabel] = useState('Nov 28, 2025 -  Nov 28, 2025');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applied, setApplied] = useState<FilterCondition[]>([
    { field: 'Server Name', criteria: 'Equals', values: ['All'] },
  ]);

  const filteredRows = applyFilterConditions(rows, applied, (row, fieldId) =>
    String(row[FIELD_KEYS[fieldId]])
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const filtersLine = `Filters: ${applied
    .map((f) => `${f.field} {${f.criteria} [${f.values.join(', ')}]}`)
    .join(' , ')}`;

  const iconButton = (label: string, child: React.ReactNode, onClick?: () => void) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-brand, #1c4599)',
        borderRadius: 'var(--radius-3xs, 3px)',
      }}
    >
      {child}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-family-primary)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--typography-heading-h1-fontSize, 32px)',
              lineHeight: 'var(--typography-heading-h1-lineHeight, 36px)',
              fontWeight: 600,
              color: 'var(--color-text-brand, #1c4599)',
            }}
          >
            Report name - All Objects Changes
          </h1>
          <p style={{ margin: '14px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary, #364765)' }}>
            {filtersLine}
          </p>
          <Breadcrumb
            style={{ marginTop: 2 }}
            items={[
              { label: 'Home', href: '#' },
              { label: 'Lepide Auditor', href: '#' },
              { label: 'Reports', href: '#' },
              { label: 'Active Directory', href: '#' },
              { label: 'All Objects Changes' },
            ]}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 19, paddingTop: 8 }}>
          {iconButton('Download report', <DownloadIcon size={26} />)}
          {iconButton('Report filters', <FilterIcon size={26} />, () => setFiltersOpen((o) => !o))}
          <DateRangeControl
            label={dateLabel}
            onPick={(label) => {
              setDateLabel(label);
              setRows([]);
              setGenerated(false);
              setPage(1);
            }}
          />
          <Button
            variant="primary"
            onClick={() => {
              setRows(generateRows());
              setGenerated(true);
              setPage(1);
            }}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* table panel */}
      <div style={{ background: 'var(--color-background-surface, #fff)', borderRadius: 'var(--radius-lg, 15px)', padding: generated ? '0 0 8px' : 0 }}>
        <Table
          columns={COLUMNS}
          data={pageRows}
          rowKey={(r) => r.id}
          emptyMessage={
            <EmptyState
              illustration={<NoRecordsIllustration size={170} />}
              message="Please click on the Generate Report button to view data"
              style={{ padding: '48px 0' }}
            />
          }
        />
        {generated && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
            <Pagination
              totalRecords={filteredRows.length}
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            />
          </div>
        )}
      </div>

      <Filter
        open={filtersOpen}
        fields={FILTER_FIELDS}
        conditions={applied}
        onCancel={() => setFiltersOpen(false)}
        onApply={(filters) => {
          setApplied(filters);
          setFiltersOpen(false);
          setPage(1);
        }}
      />
    </div>
  );
};

const FullShellPage = () => {
  const [activeKey, setActiveKey] = useState('auditor');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background-subtle, #f4f6fc)' }}>
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
      <main style={{ flex: 1, minWidth: 0, padding: '20px 28px' }}>
        <ReportViewPage />
      </main>
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/Report View',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=4-3166',
    },
    docs: { description: { component: patternDescription } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <FullShellPage />,
};
