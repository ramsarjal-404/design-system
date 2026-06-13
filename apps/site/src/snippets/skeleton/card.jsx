import { Skeleton } from '@ramsarjal-404/react';

{/* aria-busy on the container — the skeletons themselves are aria-hidden */}
<div
  aria-busy="true"
  style={{
    width: 320,
    padding: 'var(--space-8)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-background-surface)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-6)',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
    <Skeleton variant="circle" width={40} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" height={10} />
    </div>
  </div>
  <Skeleton variant="rect" height={140} />
  <Skeleton variant="text" lines={2} />
</div>
