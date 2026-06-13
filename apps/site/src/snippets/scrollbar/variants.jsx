import { Scrollbar } from '@ramsarjal-404/react';

<div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
  <Scrollbar variant="default" length={300} thumbOffset={20} />
  <Scrollbar variant="active" length={300} thumbOffset={0} />
  <Scrollbar variant="disabled" length={300} thumbOffset={20} />
</div>
