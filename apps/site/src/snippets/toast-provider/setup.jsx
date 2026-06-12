import { ToastProvider } from '@lepidus/react';

{/* Once, near the app root. duration: default auto-dismiss ms (6000);
    max: visible toasts before queueing (5). */}
<ToastProvider duration={6000} max={5}>
  <App />
</ToastProvider>
