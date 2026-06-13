import { useState } from 'react';
import { Modal, Button } from '@ramsarjal-404/react';

function AddServer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        size="lg"
        title="Please Enter Site Collection URL"
        fields={[
          {
            label: 'Site Collection:',
            defaultValue: '\\\\192.14.35.335',
            helperText: 'Please enter Site collection URL',
          },
        ]}
        onClose={() => setOpen(false)}
        primaryAction={{ label: 'Done', onClick: () => setOpen(false) }}
        secondaryAction={{ label: 'Cancel' }} // no onClick → falls back to onClose
      />
    </>
  );
}
