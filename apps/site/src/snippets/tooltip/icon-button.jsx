import { Button, CloneIcon, Tooltip } from '@lepidus/react';

// The tooltip *describes* for sighted users; aria-label still *names*
// the control for the accessibility tree.
<Tooltip content="Duplicate report">
  <Button variant="secondary" size="sm" aria-label="Duplicate report">
    <CloneIcon size={18} />
  </Button>
</Tooltip>
