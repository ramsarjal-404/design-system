import { Button, useToast } from '@ramsarjal-404/react';

function ExportButton() {
  const { toast } = useToast();
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast({ variant: 'success', title: 'Success !', message: 'Report exported to PDF.' })
      }
    >
      Export
    </Button>
  );
}
