import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../components/Table';
import type { TableColumn } from '../components/Table';
import { Dropdown } from '../components/Dropdown';

const patternDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The Team Management table matching the Figma "Team Management Table" frame
([node 653:2573](https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=653-2573)):
the **Table** component extended with an org hierarchy, checkbox columns and per-row
**Dropdown** actions. This is a *pattern*, not a component — the composition lives in page code
and the pieces stay reusable.

## Composition

- **Table** — carries the whole visual contract: 43px rows, the gray header strip, the
  per-column search row, borders and rounded top corners. Sorting is disabled on every column
  (\`sortable: false\`) because rows are ordered by hierarchy, not by value — sorting would
  scramble the org structure.
- **Name column** — a custom \`render\` implementing the tree: the green lead at the root,
  purple managers indented one step with a plus/minus toggle (\`aria-expanded\`,
  "Expand {name}'s team" labels) that reveals their reports, blue employees indented two steps.
- **Exclude / Enroll** — checkbox columns with working select-all checkboxes in the headers.
  Enroll is disabled on employee rows (they inherit their manager's enrollment), matching the
  frame's disabled checkboxes.
- **Action** — the real **Dropdown** component per row ("Select any action"), at its native
  320px pill width; disabled on employee rows exactly as drawn.

## Anatomy → token bindings

| Part | Binding (Figma → code) |
| --- | --- |
| Header strip | \`--component-table-header-bg\` → \`--gray-100\` #F6F6F6, bold 14/19 \`--color-text-primary\` |
| Cells | 43px rows, \`--component-table-cell-bg\` white, 14/19 \`--component-table-cell-text\` #364765 |
| Grid borders | \`--component-table-border\` → \`--gray-300\` #E2DBDB; 15px \`--radius-lg\` top corners |
| Expand plus/minus | \`--color-border-brand\` #1C4599 stroke (same glyph family as **FolderTree**) |
| Checkboxes | 16px, \`--color-brand-primary\` accent, \`--radius-3xs\`; disabled at 45% opacity |
| Action pill | **Dropdown** tokens: \`--component-dropdown-bg\`, \`--radius-6xl\` 30px, body-lg brand text; disabled → \`--color-button-disabled-bg\` |
| Role icons | Illustrative people-colors from the frame with **no tokens** — lead #3FB06C, manager #904EE2, employee #2E98D4 — kept local to this pattern and flagged for the token source |

## Accessibility

- Expand toggles are real buttons with \`aria-expanded\` and per-person labels; checkboxes carry
  "Exclude {name}" / "Enroll {name}" / "{label} all" \`aria-label\`s.
- Disabled controls (employee Enroll, employee Action) are natively disabled, not just styled.
- Hierarchy is conveyed by indentation *and* the role icon, not color alone.

## Usage

- **Do** keep hierarchy state (expanded managers), checkbox sets and per-row actions in page
  state — the Table stays presentational.
- **Do** disable sorting whenever rows encode structure; offer filters instead.
- **Don't** rebuild this as a one-off table — extend the same composition so the
  \`--component-table-*\` tokens keep every product table in sync.
- Note: the search row filters the *visible* (expanded) rows; expand a manager to search their
  reports.
`;

type Role = 'lead' | 'manager' | 'employee';

interface Member {
  id: string;
  name: string;
  role: Role;
  managerId?: string;
  department: string;
  jobTitle: string;
  email: string;
}

const ROSTER: Member[] = [
  { id: 'danny', name: 'Danny Murphy', role: 'lead', department: 'Development', jobTitle: 'Chief Product Officer', email: 'Danny_s@lepide.com' },
  { id: 'richard', name: 'Richard William', role: 'manager', department: 'Market', jobTitle: 'Chief Marketing Officer', email: 'Phil Richard@Lepide.com' },
  { id: 'kristin', name: 'Kristin Watson', role: 'manager', department: 'N/Technical support', jobTitle: 'Scrum Head', email: 'Kristin@Lepide.com' },
  { id: 'albert', name: 'Albert Flores', role: 'manager', department: 'Sales', jobTitle: 'Team Lead', email: 'Kathryn@Lepide.com' },
  { id: 'bessie', name: 'Bessie Cooper', role: 'manager', department: 'Customer Service', jobTitle: 'Sub Team Lead', email: 'Guy@Lepide.com' },
  { id: 'kathryn', name: 'Kathryn Murphy', role: 'employee', managerId: 'bessie', department: 'Human Resources', jobTitle: 'Sub Team Lead', email: 'Sara.Jones@lepide.com' },
  { id: 'savannah', name: 'Savannah Nguyen', role: 'employee', managerId: 'bessie', department: 'Finance', jobTitle: 'Developer', email: 'Mark_T@lepide.com' },
  { id: 'darrell', name: 'Darrell Steward', role: 'employee', managerId: 'bessie', department: 'Product Management', jobTitle: 'Marketing', email: 'Laura@Lepide.com' },
  { id: 'zain', name: 'Zain Gouse', role: 'employee', managerId: 'richard', department: 'Quality Assurance', jobTitle: 'Sub Team Lead', email: 'Tommy_M@Lepide.com' },
  { id: 'skylar', name: 'Skylar Schleifer', role: 'employee', managerId: 'richard', department: 'Operations', jobTitle: 'HR Lead', email: 'Nina_S@lepide.com' },
  { id: 'cooper', name: 'Cooper Saris', role: 'employee', managerId: 'kristin', department: 'Research and Development', jobTitle: 'Technical Support', email: 'Eli.W@lepide.com' },
];

/* Role person glyphs from the frame — illustrative colors, local to this pattern. */
const ROLE_COLORS: Record<Role, string> = { lead: '#3fb06c', manager: '#904ee2', employee: '#2e98d4' };

const PersonGlyph = ({ role }: { role: Role }) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fill={ROLE_COLORS[role]}
      d="M17.33 5.33a5.33 5.33 0 1 1-10.66 0 5.33 5.33 0 0 1 10.66 0ZM0 22.44c0-5.03 4.08-9.1 9.11-9.1h5.78c5.03 0 9.11 4.07 9.11 9.1 0 .86-.7 1.56-1.56 1.56H1.56C.7 24 0 23.3 0 22.44Z"
    />
  </svg>
);

const ToggleGlyph = ({ open }: { open: boolean }) => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="var(--color-border-brand, #1c4599)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {open ? <path d="M1 8h14" /> : <path d="M8 1v14M1 8h14" />}
  </svg>
);

const checkboxStyle = (disabled?: boolean): CSSProperties => ({
  width: 16,
  height: 16,
  margin: 0,
  accentColor: 'var(--color-brand-primary, #1c4599)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.45 : 1,
});

const ACTIONS = [
  { value: 'promote', label: 'Promote to manager' },
  { value: 'transfer', label: 'Transfer department' },
  { value: 'reset', label: 'Reset password' },
];

const TeamManagementPage = () => {
  const [expanded, setExpanded] = useState<string[]>(['bessie']);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState<string[]>([]);

  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const visible = ROSTER.filter(
    (m) => m.role !== 'employee' || expanded.includes(m.managerId ?? '')
  );

  const toggleAll = (
    list: string[],
    setList: (ids: string[]) => void,
    eligible: Member[]
  ) => {
    const allOn = eligible.every((m) => list.includes(m.id));
    setList(allOn ? list.filter((id) => !eligible.some((m) => m.id === id)) : [
      ...new Set([...list, ...eligible.map((m) => m.id)]),
    ]);
  };

  const headerCheckbox = (
    list: string[],
    setList: (ids: string[]) => void,
    label: string,
    eligible: Member[]
  ) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
      <input
        type="checkbox"
        style={checkboxStyle()}
        checked={eligible.length > 0 && eligible.every((m) => list.includes(m.id))}
        onChange={() => toggleAll(list, setList, eligible)}
        aria-label={`${label} all`}
      />
      {label}
    </span>
  );

  const columns: TableColumn<Member>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 290,
      sortable: false,
      value: (m) => m.name,
      render: (m) => {
        const indent = m.role === 'lead' ? 0 : m.role === 'manager' ? 20 : 54;
        const isManager = m.role === 'manager';
        const hasReports = ROSTER.some((r) => r.managerId === m.id);
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: indent, whiteSpace: 'nowrap' }}>
            {isManager && hasReports && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => toggleIn(prev, m.id))}
                aria-expanded={expanded.includes(m.id)}
                aria-label={`${expanded.includes(m.id) ? 'Collapse' : 'Expand'} ${m.name}'s team`}
                style={{ border: 'none', background: 'none', padding: 4, cursor: 'pointer', display: 'inline-flex' }}
              >
                <ToggleGlyph open={expanded.includes(m.id)} />
              </button>
            )}
            <PersonGlyph role={m.role} />
            {m.name}
          </span>
        );
      },
    },
    { key: 'department', header: 'Department', width: 180, sortable: false },
    { key: 'jobTitle', header: 'Job Title', width: 180, sortable: false },
    { key: 'email', header: 'Email', width: 220, sortable: false },
    {
      key: 'exclude',
      header: headerCheckbox(excluded, setExcluded, 'Exclude', visible),
      width: 120,
      sortable: false,
      filterable: false,
      align: 'center',
      render: (m) => (
        <input
          type="checkbox"
          style={checkboxStyle()}
          checked={excluded.includes(m.id)}
          onChange={() => setExcluded((prev) => toggleIn(prev, m.id))}
          aria-label={`Exclude ${m.name}`}
        />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      width: 360,
      sortable: false,
      filterable: false,
      render: (m) => (
        <Dropdown options={ACTIONS} placeholder="Select any action" disabled={m.role === 'employee'} />
      ),
    },
    {
      key: 'enroll',
      header: headerCheckbox(enrolled, setEnrolled, 'Enroll', visible.filter((m) => m.role !== 'employee')),
      width: 110,
      sortable: false,
      filterable: false,
      align: 'center',
      render: (m) => (
        <input
          type="checkbox"
          style={checkboxStyle(m.role === 'employee')}
          disabled={m.role === 'employee'}
          checked={enrolled.includes(m.id)}
          onChange={() => setEnrolled((prev) => toggleIn(prev, m.id))}
          aria-label={`Enroll ${m.name}`}
        />
      ),
    },
  ];

  return <Table columns={columns} data={visible} rowKey={(m) => m.id} />;
};

const meta: Meta = {
  title: 'Patterns/Team Management',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=653-2573',
    },
    docs: { description: { component: patternDescription } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <TeamManagementPage />,
};
