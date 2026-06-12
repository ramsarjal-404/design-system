import { Dropdown } from '@lepidus/react';

<Dropdown
  disabled
  placeholder="Select data source"
  options={[
    { value: 'ad', label: 'Active Directory' },
    { value: 'exchange', label: 'Exchange Server' },
  ]}
/>
