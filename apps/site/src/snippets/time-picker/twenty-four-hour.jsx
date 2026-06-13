import { TimePicker } from '@ramsarjal-404/react';

<TimePicker
  use24Hour
  defaultHour={18}
  defaultMinute={45}
  onConfirm={({ hour, minute, period }) => {
    // period is null in 24-hour mode
    schedule(hour, minute);
  }}
/>
