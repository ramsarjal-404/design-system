import { Calendar } from '@ramsarjal-404/react';

<Calendar
  variant="weekly"
  title="Weekly Backup"
  defaultMonth={0}
  defaultYear={2026}
  defaultSelectedDate={15}
  markedDates={[8, 14, 19, 30]} // days of the shown month with an event dot
  onDone={(value) => saveSchedule(value)} // value.weekdays: selected indices, 0=Sun…6=Sat
  onCancel={() => close()}
/>
