import { Button, Tooltip } from '@lepidus/react';

<>
  {['top-start', 'top-end', 'bottom-start', 'bottom-end'].map((placement) => (
    <Tooltip key={placement} placement={placement} content={`placement="${placement}"`}>
      <Button variant="secondary">{placement}</Button>
    </Tooltip>
  ))}
</>
