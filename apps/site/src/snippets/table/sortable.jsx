import { Table } from '@lepidus/react';

const columns = [
  { key: 'name', header: 'Server' },
  { key: 'ip', header: 'IP Address' },
];

const data = [
  { id: 'fs1', name: 'LDSP-FS-01', ip: '192.168.30.180' },
  { id: 'fs2', name: 'LDSP-FS-02', ip: '192.168.30.92' },
];

// sorting and the search row work client-side out of the box;
// pass sort/filters + onSortChange/onFiltersChange to control them instead
<Table
  columns={columns}
  data={data}
  rowKey={(row) => row.id}
  defaultSort={{ columnKey: 'name', direction: 'asc' }}
/>
