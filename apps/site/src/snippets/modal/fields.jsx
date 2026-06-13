import { Modal } from '@ramsarjal-404/react';

{/* Each row supports the full Input API — type, placeholder, status, errorMessage, helperText… */}
<Modal
  size="lg"
  title="Add Credentials"
  fields={[
    { label: 'Domain:', placeholder: 'mycompany.local' },
    { label: 'Username:', placeholder: 'username@domainname' },
    { label: 'Password:', type: 'password', placeholder: '••••••••' },
    { label: 'Confirm:', type: 'password', placeholder: '••••••••' },
  ]}
  primaryAction={{ label: 'Save', onClick: save }}
  secondaryAction={{ label: 'Cancel' }}
  onClose={close}
/>
