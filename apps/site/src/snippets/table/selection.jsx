import { useState } from 'react';
import { Table } from '@ramsarjal-404/react';

const columns = [
  { key: 'name', header: 'Server' },
  { key: 'ip', header: 'IP Address' },
];

const data = [
  { id: 'fs1', name: 'LDSP-FS-01', ip: '192.168.30.180' },
  { id: 'fs2', name: 'LDSP-FS-02', ip: '192.168.30.92' },
];

function SelectableServers() {
  const [keys, setKeys] = useState(['fs2']);

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={(row) => row.id}
      selectable
      selectedKeys={keys}
      onSelectionChange={setKeys}
    />
  );
}
