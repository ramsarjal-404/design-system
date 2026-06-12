import { Modal } from '@lepidus/react';

{/* overlay={false} embeds the shell inline — no backdrop, no focus trap, no aria-modal */}
<Modal
  overlay={false}
  size="md"
  headerAlign="left"
  title="Rename Item"
  fields={[{ label: 'Name:', defaultValue: 'Q3 Permission Report' }]}
  primaryAction={{ label: 'Rename', onClick: rename }}
  secondaryAction={{ label: 'Cancel', onClick: cancel }}
/>
