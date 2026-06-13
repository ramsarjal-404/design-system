import { Radio, RadioGroup } from '@ramsarjal-404/react';

{/* RadioGroup shares the name, renders role="radiogroup" labelled
    "Scan scope", and reports the selected value via onChange */}
<RadioGroup name="scan-scope" label="Scan scope" value={scope} onChange={setScope}>
  <Radio value="full" label="Full scan" />
  <Radio value="changed" label="Changed files only" />
  <Radio value="custom" label="Custom paths" />
</RadioGroup>
