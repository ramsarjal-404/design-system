import { Tabs } from '@lepidus/react';

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'admin', label: 'Admin', disabled: true },
  ]}
/>
