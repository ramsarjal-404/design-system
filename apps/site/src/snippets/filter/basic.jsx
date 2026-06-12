import { useState } from 'react';
import { Filter, Button } from '@lepidus/react';

const FIELDS = [
  { id: 'serverName', label: 'Server Name', values: ['DE10016.LDSP1.com', 'DE10016.LDSP2.com'] },
  { id: 'operation', label: 'Operation', values: ['Modified', 'Created', 'Deleted', 'Renamed'] },
];

function AuditFilters() {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState([
    { field: 'serverName', criteria: 'Equals', values: ['All'] },
  ]);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Open Filters</Button>
      <Filter
        open={open}
        fields={FIELDS}
        conditions={conditions}
        onApply={(next) => { setConditions(next); setOpen(false); }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
