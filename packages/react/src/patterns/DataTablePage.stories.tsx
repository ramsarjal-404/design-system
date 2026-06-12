import { useMemo, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/Card';
import { Badge, type BadgeVariant } from '../components/Badge';
import { Progress, type ProgressStatus } from '../components/Progress';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';

const patternDescription = `
A data page: a token-styled table inside a **Card**, paged for real by **Pagination**.

## Overview

The Data Table pattern composes **Card**, **Badge**, **Progress**, **Button** and **Pagination**
around a plain \`<table>\` styled exclusively with the generated \`--color-table-*\` tokens. The
table itself is deliberately not a component — the tokens carry the visual contract, so any
product table that uses them matches the system. A mock dataset of 23 restore jobs is sliced with
\`useState\` (page + page size), so the Pagination bar genuinely pages the rows.

## Composition

- **Card** — surface and title row ("Restore Jobs") with a row-count Badge in \`actions\`.
- **Badge** — Status column: \`success\` Healthy, \`warning\` Degraded, \`error\` Failed,
  \`neutral\` Archived, \`default\` Syncing.
- **Progress** — Restore column across its lifecycle: \`pending\` (queued), in-progress at
  various values, and \`completed\`.
- **Button** — \`secondary\` per-row View action.
- **Pagination** — Total Records, First/Prev/Next/Last, page input and the N/Page selector,
  all wired to the slice state.

## Design tokens

| Part | CSS variable | Light value |
| --- | --- | --- |
| Header row bg | \`--color-table-header-bg\` | \`--gray-100\` |
| Header text | \`--color-table-header-text\` | \`--blue-600\` |
| Cell text | \`--color-table-cell-text\` | \`--gray-700\` |
| Row / outer borders | \`--color-table-border\` | \`--gray-300\` |
| Row hover | \`--color-table-row-hover\` | \`--lightblue-100\` |

## Usage

- **Do** style product tables with the \`--color-table-*\` tokens so they re-theme with the system.
- **Do** keep Progress \`status="auto"\` so finished restores flip to green by themselves.
- **Don't** page on the client like this for large datasets — feed \`onPageChange\` to your query layer.
- **Don't** add more than one primary action per row; per-row actions stay \`secondary\`.
`;

type JobStatus = 'Healthy' | 'Degraded' | 'Failed' | 'Archived' | 'Syncing';

const STATUS_VARIANT: Record<JobStatus, BadgeVariant> = {
  Healthy: 'success',
  Degraded: 'warning',
  Failed: 'error',
  Archived: 'neutral',
  Syncing: 'default',
};

interface Job {
  id: number;
  name: string;
  status: JobStatus;
  restoreValue: number;
  restoreStatus: ProgressStatus;
  restoreLabel: string;
}

const SERVERS = [
  'AD-Primary',
  'Exchange-01',
  'SQL-Cluster',
  'FileServer-East',
  'SharePoint-Hub',
  'Entra-Sync',
  'GroupPolicy-Core',
  'AuditStore-West',
] as const;

const STATUSES: JobStatus[] = ['Healthy', 'Syncing', 'Degraded', 'Healthy', 'Failed', 'Archived'];

/** Deterministic mock dataset of 23 restore jobs. */
const JOBS: Job[] = Array.from({ length: 23 }, (_, i) => {
  const phase = i % 4;
  const value = phase === 0 ? 100 : phase === 3 ? 0 : ((i * 17) % 80) + 15;
  return {
    id: i + 1,
    name: `${SERVERS[i % SERVERS.length]}-${String(i + 1).padStart(2, '0')}`,
    status: STATUSES[i % STATUSES.length],
    restoreValue: value,
    restoreStatus: phase === 3 ? 'pending' : 'auto',
    restoreLabel: phase === 3 ? 'Queued' : phase === 0 ? 'Completed' : 'Restore in Progress',
  };
});

const cellBase: CSSProperties = {
  padding: '12px 16px',
  fontSize: 14,
  lineHeight: '19px',
  color: 'var(--color-table-cell-text)',
  borderBottom: '1px solid var(--color-table-border)',
  textAlign: 'left',
  verticalAlign: 'middle',
};

const headerCell: CSSProperties = {
  ...cellBase,
  background: 'var(--color-table-header-bg)',
  color: 'var(--color-table-header-text)',
  fontWeight: 600,
  borderBottom: '1px solid var(--color-table-border)',
};

const DataTablePage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.max(1, Math.ceil(JOBS.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rows = useMemo(
    () => JOBS.slice((safePage - 1) * pageSize, safePage * pageSize),
    [safePage, pageSize]
  );

  return (
    <div style={{ maxWidth: 960 }}>
      <style>{`.lds-pattern-table tbody tr:hover td { background: var(--color-table-row-hover); }`}</style>
      <Card
        title="Restore Jobs"
        actions={<Badge variant="default">{JOBS.length} jobs</Badge>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <table
            className="lds-pattern-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid var(--color-table-border)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr>
                <th style={headerCell}>Name</th>
                <th style={headerCell}>Status</th>
                <th style={{ ...headerCell, width: 320 }}>Restore</th>
                <th style={{ ...headerCell, width: 96 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((job) => (
                <tr key={job.id}>
                  <td style={cellBase}>{job.name}</td>
                  <td style={cellBase}>
                    <Badge variant={STATUS_VARIANT[job.status]} dot>
                      {job.status}
                    </Badge>
                  </td>
                  <td style={cellBase}>
                    <Progress
                      label={job.restoreLabel}
                      value={job.restoreValue}
                      status={job.restoreStatus}
                    />
                  </td>
                  <td style={cellBase}>
                    <Button variant="secondary">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalRecords={JOBS.length}
            currentPage={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 20]}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/Data Table',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: patternDescription } },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <DataTablePage />,
  parameters: {
    docs: {
      description: {
        story:
          'The full page over a 23-row mock dataset. Use First/Prev/Next/Last, the page input, or the N/Page selector — the table re-slices live, and hovering a row shows `--color-table-row-hover`.',
      },
    },
  },
};
