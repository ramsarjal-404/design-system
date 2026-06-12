import { Stepper } from '@lepidus/react';

<Stepper
  defaultValue={30}
  min={0}
  max={365}
  step={1}
  aria-label="Retention days"
  onChange={(value) => console.log(value)}
/>
