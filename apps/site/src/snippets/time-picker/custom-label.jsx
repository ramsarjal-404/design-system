import { TimePicker } from '@ramsarjal-404/react';

<TimePicker
  label="Remind me at"
  defaultHour={9}
  defaultMinute={30}
  defaultPeriod="PM"
  onConfirm={(value) => saveReminder(value)}
/>
