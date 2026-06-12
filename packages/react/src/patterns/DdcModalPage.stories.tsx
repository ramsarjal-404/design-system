import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Table } from '../components/Table';
import type { TableColumn } from '../components/Table';
import { Breadcrumb } from '../components/Breadcrumb';
import { Steps } from '../components/Steps';
import { Tag } from '../components/Tag';
import {
  UserServiceSettingIcon,
  ReportIcon,
  AddFileIcon,
  SqlIcon,
  GeneralSettingsIcon,
  RefreshIcon,
} from '../icons';

const patternDescription = `
![Status: Stable](https://img.shields.io/badge/Status-Stable-1caa52)

The DDC "Create Profile" wizard modal matching the Design Essentials frame
([node 373:6363](https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=373-6363)):
a five-step Data Discovery & Classification wizard on a dimmed, blurred backdrop. Every state is
functional — steps, rail, dots, form, folder table and footer all work.

## Composition & behavior

- **Wizard surface** — a full-size modal (the frame's 1709px surface ≈ 92vw) with a white header
  strip and the \`--lightblue-50\`-ish body (frame #F7FCFF — flagged). The standard **Modal**
  component stays for ordinary dialogs; wizards earn their own surface.
- **Header** — back arrow (steps back; closes on step 1), the **Breadcrumb**
  (Profile List / Create Profile), and the **Steps** component (five dots + "{n} of 5"), in sync with the rail and Next/Back; completed dots navigate back.
- **Step rail** — the navy rounded pill down the left: five steps (Profile Settings, Template,
  File Type, SQL Server Settings, Classification) with icon + 10px label; the active step gets
  the \`--blue-650\` circle with the white dashed ring, exactly as drawn. Steps are buttons —
  clicking jumps to a visited step.
- **Step 1 form** — "Profile Name & Object Selection": **Input** fields (Profile Name,
  Description, User Name with the "Example : Domain\\\\UserName" helper, Password) with
  brand-blue labels per the frame.
- **Folder table** — **Add From** appends folder rows (Folder Path / Server / Action); the
  Action column deletes its row; empty state prompts for Add From.
- **Step 2 — Select Templates (drag & drop)** — matches the "Create-template-drag-and-drop"
  frame ([node 637:7813](https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus?node-id=637-7813)).
  The **Table** (Template / Type / Description / Tags, with selection checkboxes, sort and the
  filter row) sits left; the dashed drop zone sits right. Each Tags cell is a draggable chip —
  drag it into the zone (or click it, the keyboard path) to create a template. Dropped templates
  render as dismissible **Tag** chips. Header actions: refresh resets the step, **Delete All**
  (danger) empties the zone, **Create New Templates** adds every checked row at once.
- **Footer** — Cancel closes the wizard (the trigger button reopens it); Back appears from
  step 2 on, per the frame; Next advances and becomes **Finish** on step 5, which closes.
  Drag-and-drop state lives in the wizard, so Back/Next never loses dropped templates.

## Anatomy → token bindings

| Part | Binding (Figma → code) |
| --- | --- |
| Backdrop | dimmed \`rgba(0,0,0,0.5)\` over the blurred console mock |
| Header strip | \`--color-background-surface\`, breadcrumb component tokens |
| Step dots | \`--color-status-success-text\` ring on current, \`--color-brand-primary\` fill on done, \`--color-border-default\` upcoming |
| Step rail | \`--color-brand-primary\` pill, active circle \`--blue-650\` + white dashed ring, 10px white labels |
| Body | frame #F7FCFF ≈ \`--lightblue-50\` (flagged) |
| Section title | bold \`--font-size-20\` in \`--color-text-brand\` |
| Form fields | the **Input** component (labels styled brand per the frame — Input's gray label token flagged as drift) |
| Folder table | \`--component-table-*\` chain |
| Template table | \`--component-table-*\` chain; draggable tag chips on \`--lightblue-50\` + \`--color-border-brand\` |
| Drop zone | dashed \`--color-border-brand\` on \`--color-background-surface\`, brand tint + solid border while dragging over |
| Dropped chips | the **Tag** component (neutral) with its dismiss button |
| Buttons | **Button** primary/secondary/danger |

## Accessibility

- The wizard is \`role="dialog"\` \`aria-modal\`, labelled by the step title; Escape cancels.
- Dots are decorative (\`aria-hidden\`) — the "{n} of 5" text and the rail's \`aria-current\` step
  carry the state; rail steps are real buttons, disabled until visited.
- Inputs are labelled; the delete actions name their row ("Remove {path}").
- Drag-and-drop is never the only path: every draggable tag chip is a real button
  ("Add {tag} template"), so click/Enter does what the drag does; dropped chips remove via the
  Tag dismiss button; the zone announces its count through a polite live region.

## Usage

- **Do** keep each step's state in the wizard (not per-step components) so Back never loses data.
- **Do** validate on Next, not on every keystroke, for wizard forms.
- **Don't** use this surface for simple confirmations — that's the **Modal** component.
`;

/* ---------- step metadata ---------- */

const STEPS = [
  { key: 'profile', label: 'Profile Settings', icon: <UserServiceSettingIcon size={26} /> },
  { key: 'template', label: 'Template', icon: <ReportIcon size={26} /> },
  { key: 'filetype', label: 'File Type', icon: <AddFileIcon size={26} /> },
  { key: 'sql', label: 'SQL Server Settings', icon: <SqlIcon size={26} /> },
  { key: 'classification', label: 'Classification', icon: <GeneralSettingsIcon size={26} /> },
];

interface FolderRow {
  id: string;
  folderPath: string;
  server: string;
}

const brandLabel = (text: string) => (
  <span style={{ color: 'var(--color-text-brand, #1c4599)', fontWeight: 600 }}>{text}</span>
);

/* ---------- step 2: select templates (drag & drop) ---------- */

interface TemplateRow {
  id: string;
  template: string;
  type: string;
  description: string;
  tag: string;
}

const TEMPLATE_ROWS: TemplateRow[] = [
  { id: 't1', template: 'US Passport Number', type: 'Default', description: 'US Passport Number', tag: 'US National Identity' },
  { id: 't2', template: 'Argentina National Identity (DNI)', type: 'Default', description: 'Argentina National Identity (DNI)', tag: 'Argentina National Identity' },
  { id: 't3', template: 'UK National Insurance Number', type: 'Default', description: 'UK National Insurance Number (NINO)', tag: 'UK National Identity' },
  { id: 't4', template: 'Canada Social Insurance Number', type: 'Default', description: 'Canada Social Insurance Number (SIN)', tag: 'Canada National Identity' },
  { id: 't5', template: 'India Aadhaar Number', type: 'Default', description: 'India Unique Identification Number', tag: 'India National Identity' },
  { id: 't6', template: 'Germany Identity Card Number', type: 'Default', description: 'Germany Personalausweis Number', tag: 'Germany National Identity' },
  { id: 't7', template: 'France Social Security Number', type: 'Default', description: 'France INSEE Number', tag: 'France National Identity' },
  { id: 't8', template: 'Australia Tax File Number', type: 'Custom', description: 'Australia Tax File Number (TFN)', tag: 'Australia National Identity' },
  { id: 't9', template: 'Brazil CPF Number', type: 'Custom', description: 'Brazil Natural Persons Register', tag: 'Brazil National Identity' },
  { id: 't10', template: 'Japan My Number', type: 'Custom', description: 'Japan Individual Number', tag: 'Japan National Identity' },
];

/** The hand-dragging-a-card illustration inside the empty drop zone (frame image 514). */
const DropIllustration = () => (
  <svg width={132} height={116} viewBox="0 0 132 116" fill="none" aria-hidden="true">
    <rect x={56} y={4} width={48} height={42} rx={8} stroke="var(--color-border-brand, #1c4599)" strokeWidth={2.5} strokeDasharray="6 6" />
    <path d="M80 17v16M72 25h16" stroke="var(--color-border-brand, #1c4599)" strokeWidth={2.5} strokeLinecap="round" />
    <rect x={22} y={30} width={52} height={46} rx={9} fill="var(--lightblue-50, #eef4ff)" stroke="var(--color-brand-primary, #1c4599)" strokeWidth={3} />
    <path
      d="M62 62v18c0 2 1 4 3 5l-9 6c-3 2-7 2-9-1L33 74c-1.5-2-1-5 1-6.5s5-1 6.5 1l5 6V51c0-2.5 2-4.5 4.5-4.5S55 48.5 55 51v11c0-2.5 2-4.5 4.5-4.5S62 59.5 62 62Z"
      fill="var(--color-background-surface, #fff)"
      stroke="var(--color-brand-primary, #1c4599)"
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

interface TemplateStepProps {
  dropped: string[];
  onDroppedChange: (ids: string[]) => void;
  selected: Array<string | number>;
  onSelectedChange: (keys: Array<string | number>) => void;
}

const TemplateStep = ({ dropped, onDroppedChange, selected, onSelectedChange }: TemplateStepProps) => {
  const [isOver, setIsOver] = useState(false);

  const addTemplates = (ids: string[]) =>
    onDroppedChange([...dropped, ...ids.filter((id) => !dropped.includes(id))]);

  const tagChip = (row: TemplateRow) => {
    const added = dropped.includes(row.id);
    return (
      <button
        type="button"
        draggable={!added}
        disabled={added}
        aria-label={added ? `${row.tag} template added` : `Add ${row.tag} template`}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', row.id);
          e.dataTransfer.effectAllowed = 'copy';
        }}
        onClick={() => addTemplates([row.id])}
        style={{
          font: 'inherit',
          padding: '3px 12px',
          borderRadius: 'var(--radius-xlg, 26px)',
          border: '1px solid var(--color-border-brand, #1c4599)',
          background: added ? 'var(--color-background-subtle, #f6f6f6)' : 'var(--lightblue-50, #eef4ff)',
          color: added ? 'var(--color-text-secondary, #555766)' : 'var(--color-text-brand, #1c4599)',
          borderColor: added ? 'var(--color-border-default, #d9d9d9)' : 'var(--color-border-brand, #1c4599)',
          cursor: added ? 'default' : 'grab',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={row.tag}
      >
        {row.tag}
        {added && ' ✓'}
      </button>
    );
  };

  const templateColumns: TableColumn<TemplateRow>[] = [
    { key: 'template', header: 'Template' },
    { key: 'type', header: 'Type', width: 120 },
    { key: 'description', header: 'Description' },
    { key: 'tags', header: 'Tags', value: (row) => row.tag, render: (row) => tagChip(row) },
  ];

  const droppedRows = dropped
    .map((id) => TEMPLATE_ROWS.find((r) => r.id === id))
    .filter((r): r is TemplateRow => r !== undefined);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* header actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end' }}>
        <button
          type="button"
          aria-label="Refresh templates"
          onClick={() => {
            onDroppedChange([]);
            onSelectedChange([]);
          }}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-brand, #1c4599)', display: 'inline-flex', padding: 4 }}
        >
          <RefreshIcon size={26} />
        </button>
        <Button variant="danger" disabled={dropped.length === 0} onClick={() => onDroppedChange([])}>
          Delete All
        </Button>
        <Button
          variant="primary"
          disabled={selected.length === 0}
          onClick={() => addTemplates(selected.map(String))}
        >
          Create New Templates
        </Button>
      </div>

      {/* table + drop zone */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 24 }}>
        <div style={{ flex: '1 1 62%', minWidth: 0, overflowY: 'auto', background: 'var(--color-background-surface, #fff)', borderRadius: 'var(--radius-3xs, 3px)', border: '1px solid var(--color-border-strong, #e2dbdb)', alignSelf: 'flex-start', maxHeight: '100%' }}>
          <Table
            columns={templateColumns}
            data={TEMPLATE_ROWS}
            rowKey={(r) => r.id}
            selectable
            selectedKeys={selected}
            onSelectionChange={onSelectedChange}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOver(false);
            const id = e.dataTransfer.getData('text/plain');
            if (TEMPLATE_ROWS.some((r) => r.id === id)) addTemplates([id]);
          }}
          role="region"
          aria-label="Template drop zone"
          style={{
            position: 'relative',
            flex: '1 1 38%',
            minWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: droppedRows.length === 0 ? 'center' : 'flex-start',
            gap: 18,
            padding: 24,
            borderRadius: 'var(--radius-s, 6px)',
            border: `1.5px ${isOver ? 'solid' : 'dashed'} var(--color-border-brand, #1c4599)`,
            background: isOver ? 'var(--lightblue-50, #eef4ff)' : 'var(--color-background-surface, #fff)',
            transition: 'background 120ms ease',
            overflowY: 'auto',
          }}
        >
          {droppedRows.length === 0 ? (
            <>
              <DropIllustration />
              <p style={{ margin: 0, fontSize: 16, color: 'var(--color-text-primary, #364765)', textAlign: 'center' }}>
                Drag and Drop the tag name to create template
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, alignSelf: 'flex-start', fontWeight: 700, fontSize: 14, color: 'var(--color-text-brand, #1c4599)' }}>
                Templates ({droppedRows.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignSelf: 'flex-start' }}>
                {droppedRows.map((row) => (
                  <Tag
                    key={row.id}
                    variant="neutral"
                    onRemove={() => onDroppedChange(dropped.filter((id) => id !== row.id))}
                    removeLabel={`Remove ${row.tag} template`}
                  >
                    {row.tag}
                  </Tag>
                ))}
              </div>
            </>
          )}
          <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
            {droppedRows.length} template{droppedRows.length === 1 ? '' : 's'} added
          </span>
        </div>
      </div>
    </div>
  );
};

/* ---------- the wizard ---------- */

const DdcWizard = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(1);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [profile, setProfile] = useState({ name: 'DDC09', description: 'Australian ID Card Details', user: 'Chily/Richard', password: 'secret1' });
  const [droppedTemplates, setDroppedTemplates] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Array<string | number>>([]);

  const goTo = (i: number) => {
    setStep(i);
    setVisited((v) => Math.max(v, i + 1));
  };

  const addFolder = () => {
    setFolders((prev) => [
      ...prev,
      {
        id: `f${prev.length}`,
        folderPath: `\\\\192.168.30.${206 + prev.length}\\share\\DDC-${prev.length + 1}`,
        server: `DE10016.LDSP${(prev.length % 3) + 1}.com`,
      },
    ]);
  };

  const folderColumns: TableColumn<FolderRow>[] = [
    { key: 'folderPath', header: 'Folder Path' },
    { key: 'server', header: 'Server', width: 320 },
    {
      key: 'action',
      header: 'Action',
      width: 110,
      sortable: false,
      filterable: false,
      align: 'center',
      render: (row) => (
        <button
          type="button"
          aria-label={`Remove ${row.folderPath}`}
          onClick={() => setFolders((prev) => prev.filter((f) => f.id !== row.id))}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-danger, #f72b2b)', fontSize: 16, lineHeight: 1 }}
        >
          ✕
        </button>
      ),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Create Profile — ${STEPS[step].label}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        fontFamily: 'var(--font-family-primary)',
      }}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        style={{
          width: '92vw',
          maxWidth: 1709,
          height: 'min(873px, 92vh)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-background-surface, #fff)',
          overflow: 'hidden',
        }}
      >
        {/* header strip */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 24px' }}>
          <button
            type="button"
            aria-label={step === 0 ? 'Close wizard' : 'Back'}
            onClick={() => (step === 0 ? onClose() : goTo(step - 1))}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-brand, #1c4599)', display: 'inline-flex', padding: 6 }}
          >
            <svg width={22} height={18} viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 1 1 9l8 8M1 9h20" />
            </svg>
          </button>
          <Breadcrumb items={[{ label: 'Profile List', href: '#' }, { label: 'Create Profile' }]} />
          <div style={{ marginLeft: 'auto' }}>
            <Steps total={STEPS.length} current={step + 1} onStepClick={(s) => s - 1 < visited && goTo(s - 1)} />
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 24, padding: '16px 24px 20px', background: 'var(--lightblue-50, #f5f7fd)' }}>
          {/* step rail */}
          <nav
            aria-label="Wizard steps"
            style={{
              flexShrink: 0,
              width: 78,
              padding: '12px 0',
              background: 'var(--color-brand-primary, #1c4599)',
              borderRadius: 'var(--radius-full, 50px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 26,
              alignSelf: 'flex-start',
            }}
          >
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-current={i === step ? 'step' : undefined}
                disabled={i >= visited && i !== step}
                onClick={() => i < visited && goTo(i)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  border: 'none',
                  background: 'none',
                  cursor: i < visited ? 'pointer' : 'default',
                  color: '#fff',
                  padding: 0,
                  width: 70,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i === step ? 'var(--blue-650, #11337a)' : 'transparent',
                    border: i === step ? '1px dashed #fff' : '1px solid transparent',
                    color: '#fff',
                  }}
                >
                  {s.icon}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{s.label}</span>
              </button>
            ))}
          </nav>

          {/* step content */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 'var(--font-size-20, 20px)', fontWeight: 700, color: 'var(--color-text-brand, #1c4599)' }}>
              {step === 0 ? 'Profile Name & Object Selection' : step === 1 ? 'Select Templates' : STEPS[step].label}
            </h2>

            {step === 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '6px 28px' }}>
                  <Input label={brandLabel('Profile Name')} labelWidth={110} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label={brandLabel('Description')} labelWidth={110} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} />
                  <Input label={brandLabel('User Name')} labelWidth={110} value={profile.user} helperText="Example : Domain\UserName" onChange={(e) => setProfile({ ...profile, user: e.target.value })} />
                  <Input label={brandLabel('Password')} labelWidth={110} type="password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" onClick={addFolder}>Add From</Button>
                </div>

                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--color-background-surface, #fff)', borderRadius: 'var(--radius-3xs, 3px)', border: '1px solid var(--color-border-strong, #e2dbdb)' }}>
                  <Table
                    columns={folderColumns}
                    data={folders}
                    rowKey={(r) => r.id}
                    filterRow={false}
                    emptyMessage='No folders added — click "Add From" to select folder paths'
                  />
                </div>
              </>
            ) : step === 1 ? (
              <TemplateStep
                dropped={droppedTemplates}
                onDroppedChange={setDroppedTemplates}
                selected={selectedTemplates}
                onSelectedChange={setSelectedTemplates}
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-background-surface, #fff)',
                  border: '1px solid var(--color-border-strong, #e2dbdb)',
                  borderRadius: 'var(--radius-3xs, 3px)',
                  color: 'var(--color-text-secondary, #555766)',
                  fontSize: 14,
                }}
              >
                {STEPS[step].label} configuration goes here.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              {step > 0 && (
                <Button variant="secondary" onClick={() => goTo(step - 1)}>Back</Button>
              )}
              <Button
                variant="primary"
                onClick={() => (step === STEPS.length - 1 ? onClose() : goTo(step + 1))}
              >
                {step === STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- backdrop mock + story ---------- */

const DdcModalPage = () => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-subtle, #f6f6f6)', fontFamily: 'var(--font-family-primary)' }}>
      {/* blurred admin-console stand-in */}
      <div style={{ filter: open ? 'blur(5px)' : 'none', padding: 32, transition: 'filter 160ms ease' }}>
        <h1 style={{ margin: 0, fontSize: 27, fontWeight: 700, color: 'var(--color-text-primary, #364765)' }}>Admin Console</h1>
        <p style={{ color: 'var(--color-text-secondary, #555766)', fontSize: 14, maxWidth: 520 }}>
          Data Source configuration sits behind the wizard. Open the Create Profile wizard to see the DDC modal.
        </p>
        <Button variant="primary" onClick={() => setOpen(true)}>Open Create Profile</Button>
      </div>
      {open && <DdcWizard onClose={() => setOpen(false)} />}
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/DDC Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/I8EDDuGQvAql1gA6gQ4YKe/Design-Essentials?node-id=373-6363',
    },
    docs: { description: { component: patternDescription } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <DdcModalPage />,
};
