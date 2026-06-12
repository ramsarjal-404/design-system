import { AlertPanel, Button } from '@lepidus/react';

<AlertPanel
  severity="warning"
  title="Mass files copied"
  details={<EvidenceTable rows={scriptExecutions} />} // any node: a small table, key/value grid…
  action={<Button variant="primary">View Report</Button>}
  footnote="Now you can check the report directly on LDSP web - console"
>
  You have received this alert because <strong>5 change(s)</strong> have been made in your{' '}
  <strong>File Server</strong> and <strong>Script execution</strong> was initiated.
</AlertPanel>
