import { ActionItem, defaultActions } from '@lepidus/react';

// Disable a single action — it dims to 40% and leaves the tab order.
<ActionItem
  actions={defaultActions.map((action) =>
    action.id === 'delete' ? { ...action, disabled: true } : action
  )}
/>
