import { Table, Badge, Button } from '@lepidus/react';

const data = [
  { id: 'fs1', name: 'LDSP-FS-01', status: 'Healthy' },
  { id: 'fs2', name: 'LDSP-FS-02', status: 'Degraded' },
  { id: 'fs3', name: 'LDSP-FS-03', status: 'Offline' },
];

const columns = [
  { key: 'name', header: 'Server' },
  {
    key: 'status',
    header: 'Status',
    // keep value implicit (row.status) so sorting/filtering still work
    render: (row) => (
      <Badge variant={row.status === 'Healthy' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    sortable: false,
    filterable: false,
    render: () => <Button variant="secondary" size="sm">View</Button>,
  },
];

<Table columns={columns} data={data} rowKey={(row) => row.id} />
