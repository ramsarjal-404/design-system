import { Breadcrumb } from '@lepidus/react';

<Breadcrumb
  items={[
    { label: 'Setup', onClick: () => router.push('/setup') },
    { label: 'Data Sources', onClick: () => router.push('/setup/sources') },
    { label: 'Add Data Source' },
  ]}
/>
