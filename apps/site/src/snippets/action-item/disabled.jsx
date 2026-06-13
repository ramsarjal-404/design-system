import { ActionItem, defaultActions } from '@ramsarjal-404/react';

// Disable a single action — it dims to 40% and leaves the tab order.
<ActionItem
  actions={defaultActions.map((action) =>
    action.id === 'delete' ? { ...action, disabled: true } : action
  )}
/>
