import { useState } from 'react';
import { Filter, applyFilterConditions } from '@lepidus/react';

const FIELDS = [
  { id: 'objectClass', label: 'Object Class', values: ['user', 'group', 'account'] },
  { id: 'operation', label: 'Operation', values: ['Modified', 'Created', 'Deleted'] },
];

const ITEMS = [
  { name: 'Object-01', objectClass: 'user', operation: 'Modified' },
  { name: 'Object-02', objectClass: 'group', operation: 'Created' },
  { name: 'Object-03', objectClass: 'user', operation: 'Deleted' },
];

function FilteredList() {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState([]);

  // Re-filters only when Apply commits a new condition list.
  const visible = applyFilterConditions(ITEMS, conditions, (item, fieldId) =>
    String(item[fieldId])
  );

  return (
    <>
      <ul>{visible.map((item) => <li key={item.name}>{item.name}</li>)}</ul>
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
