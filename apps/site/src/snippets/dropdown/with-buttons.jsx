import { Dropdown } from '@lepidus/react';

// Draft-then-Apply: checkbox clicks edit a draft; onChange/onApply
// fire only when Apply is pressed, Cancel discards the draft.
<Dropdown
  multiple
  showButtons
  placeholder="Select servers"
  defaultValue={['fs-01', 'fs-02']}
  options={[
    { value: 'fs-01', label: 'LDSP-FS-01' },
    { value: 'fs-02', label: 'LDSP-FS-02' },
    { value: 'fs-03', label: 'LDSP-FS-03' },
  ]}
  onApply={(values) => refetchTable(values)}
  onCancel={() => console.log('draft discarded')}
/>
