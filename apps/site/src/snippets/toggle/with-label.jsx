import { Toggle } from '@ramsarjal-404/react';

{/* controlled usage paired with a visible label — the settings-row pattern */}
<label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
  <Toggle checked={on} onChange={setOn} aria-label="Auto-backup" />
  Auto-backup {on ? 'enabled' : 'disabled'}
</label>
