import { Button, useToast } from '@ramsarjal-404/react';

{/* Inside a <ToastProvider> subtree — see /components/toast-provider/ */}
function ScanButton() {
  const { toast } = useToast();
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast({ variant: 'info', title: 'Scan started', message: 'LDSP-FS-01 is being scanned.' })
      }
    >
      Show toast
    </Button>
  );
}
