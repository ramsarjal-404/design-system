import { Breadcrumb } from '@ramsarjal-404/react';

<Breadcrumb
  items={[
    { label: 'Setup', onClick: () => router.push('/setup') },
    { label: 'Data Sources', onClick: () => router.push('/setup/sources') },
    { label: 'Add Data Source' },
  ]}
/>
