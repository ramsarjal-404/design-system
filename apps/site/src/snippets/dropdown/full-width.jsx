import { Dropdown } from '@ramsarjal-404/react';

{/* fullWidth stretches the pill to its container instead of the fixed 320px */}
<div style={{ maxWidth: 640 }}>
  <Dropdown
    fullWidth
    placeholder="Select data source"
    options={[
      { value: 'ad', label: 'Active Directory' },
      { value: 'fs', label: 'File Server' },
      { value: 'm365', label: 'Microsoft 365' },
    ]}
  />
</div>
