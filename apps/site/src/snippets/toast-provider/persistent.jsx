import { useToast } from '@ramsarjal-404/react';

function useScanNotifications() {
  const { toast, dismiss } = useToast();

  async function runScan() {
    // duration: 0 → persists until dismissed (close button or dismiss(id))
    const id = toast({ variant: 'info', title: 'Scanning…', message: 'LDSP-FS-01', duration: 0 });
    try {
      await scan();
      toast({ variant: 'success', title: 'Success !', message: 'Scan complete.' });
    } finally {
      dismiss(id); // runs the exit animation, then removes the toast
    }
  }

  return runScan;
}
