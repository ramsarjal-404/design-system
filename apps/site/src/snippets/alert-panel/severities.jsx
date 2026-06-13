import { AlertPanel } from '@ramsarjal-404/react';

<>
  {['warning', 'success', 'error', 'info'].map((severity) => (
    <AlertPanel key={severity} severity={severity} title="Mass files copied">
      Severity: <strong>{severity}</strong>
    </AlertPanel>
  ))}
</>
