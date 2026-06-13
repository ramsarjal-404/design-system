import { Dropdown } from '@ramsarjal-404/react';

<Dropdown
  multiple
  placeholder="Select servers"
  defaultValue={['fs-01']}
  options={[
    { value: 'fs-01', label: 'LDSP-FS-01' },
    { value: 'fs-02', label: 'LDSP-FS-02' },
    { value: 'fs-03', label: 'LDSP-FS-03' },
  ]}
  onChange={(values) => console.log(values)} // string[] in multiple mode
/>
