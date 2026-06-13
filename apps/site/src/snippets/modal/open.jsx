import { Modal } from '@ramsarjal-404/react';

{/* open defaults to true — render conditionally in production (see the trigger example) */}
<Modal
  size="lg"
  title="Please Enter Site Collection URL"
  fields={[
    {
      label: 'Site Collection:',
      defaultValue: '\\\\192.14.35.335',
      helperText: 'Please enter Site collection URL',
    },
  ]}
  primaryAction={{ label: 'Done', onClick: submit }}
  secondaryAction={{ label: 'Cancel' }}
  onClose={close}
/>
