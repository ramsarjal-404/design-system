import { Message } from '@lepidus/react';

<Message
  variant="success"
  title="Backup completed"
  primaryAction={{ label: 'Done', onClick: acknowledge }}
  onClose={dismiss}
>
  All 1,248 objects were backed up successfully. The next scheduled run is tonight at 2:00 AM.
</Message>
