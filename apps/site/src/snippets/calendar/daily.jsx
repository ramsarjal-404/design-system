import { Calendar } from '@ramsarjal-404/react';

<Calendar
  variant="daily"
  defaultMonth={0}        // January (0–11)
  defaultYear={2026}
  defaultSelectedDate={15}
  onSelectDate={({ year, month, day }) => console.log(year, month, day)}
  onDone={(value) => saveSchedule(value)} // { year, month, day, time, weekdays, dates }
  onCancel={() => close()}
/>
