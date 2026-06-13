import { Card, Button } from '@ramsarjal-404/react';

<Card
  title="Delete workspace"
  footer={
    <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger">Delete</Button>
    </div>
  }
>
  This permanently removes the workspace and all associated credentials.
  This cannot be undone.
</Card>
