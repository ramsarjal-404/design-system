import { TimePicker } from '@lepidus/react';

<TimePicker
  defaultHour={7}
  defaultMinute={0}
  defaultPeriod="AM"
  onConfirm={({ hour, minute, period }) => setReminder(hour, minute, period)}
  onCancel={() => close()}
/>
