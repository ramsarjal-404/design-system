import { Table } from '@lepidus/react';

const columns = [
  { key: 'name', header: 'Server' },
  { key: 'ip', header: 'IP Address' },
  { key: 'lastScan', header: 'Last scan' },
];

const data = [
  { id: 'fs1', name: 'LDSP-FS-01', ip: '192.168.30.180', lastScan: '2 hours ago' },
  { id: 'fs2', name: 'LDSP-FS-02', ip: '192.168.30.92', lastScan: '5 hours ago' },
  { id: 'fs3', name: 'LDSP-FS-03', ip: '192.168.30.41', lastScan: '2 days ago' },
];

<Table columns={columns} data={data} rowKey={(row) => row.id} filterRow={false} />
