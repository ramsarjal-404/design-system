import { TimePicker } from '@ramsarjal-404/react';

<TimePicker
  defaultHour={7}
  defaultMinute={0}
  defaultPeriod="AM"
  onConfirm={({ hour, minute, period }) => setReminder(hour, minute, period)}
  onCancel={() => close()}
/>
