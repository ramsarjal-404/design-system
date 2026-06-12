import { Dropdown } from '@lepidus/react';

<Dropdown
  placeholder="Select data source"
  options={[
    { value: 'ad', label: 'Active Directory' },
    { value: 'exchange', label: 'Exchange Server' },
    { value: 'sharepoint', label: 'SharePoint' },
  ]}
  onChange={(value) => console.log(value)}
/>
