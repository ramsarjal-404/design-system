import { AlertPanel, Button } from '@lepidus/react';

<AlertPanel
  severity="success"
  title="Mass files copied"
  action={<Button variant="primary">View Report</Button>}
  footnote="Now you can check the report directly on LDSP web - console"
>
  You have received this alert because <strong>5 change(s)</strong> have been made in your{' '}
  <strong>File Server</strong>.
</AlertPanel>
