import { Radio, RadioGroup } from '@ramsarjal-404/react';

<RadioGroup name="export" label="Export format" defaultValue="csv">
  <Radio value="csv" label="CSV" />
  <Radio value="json" label="JSON" error />
  <Radio value="xml" label="XML (requires Enterprise plan)" disabled />
</RadioGroup>
