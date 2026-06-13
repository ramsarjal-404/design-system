import { Button, Badge } from '@ramsarjal-404/react';

export function ReportToolbar() {
  return (
    <>
      <Button variant="primary">Run scan</Button>
      <Button variant="secondary">Export report</Button>
      <Badge variant="success">14 servers healthy</Badge>
    </>
  );
}
