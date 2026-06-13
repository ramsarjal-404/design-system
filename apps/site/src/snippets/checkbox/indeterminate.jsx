import { Checkbox } from '@ramsarjal-404/react';

// `indeterminate` sets the DOM property and aria-checked="mixed".
// Drive it from the group state — it clears on the next user toggle.
<Checkbox
  label="Select all permissions"
  indeterminate={selected.length > 0 && selected.length < options.length}
  checked={selected.length === options.length}
  onChange={(next) => setSelected(next ? [...options] : [])}
/>
