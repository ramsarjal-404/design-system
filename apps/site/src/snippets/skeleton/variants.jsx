import { Skeleton } from '@ramsarjal-404/react';

<div aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
  <Skeleton variant="text" />
  <Skeleton variant="circle" width={40} />
  <Skeleton variant="rect" height={96} />
</div>
