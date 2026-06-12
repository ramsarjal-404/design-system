import { Calendar } from '@lepidus/react';

<Calendar
  variant="monthly"
  defaultMonth={0}
  defaultYear={2026}
  defaultSelectedDate={15}
  yearRange={[-2, 10]} // year dropdown offsets relative to today (default [-5, 5])
  onDone={({ weekdays, dates, time }) => {
    // weekdays: 0=Sun…6=Sat; dates: selected days of month (1–31)
    saveSchedule({ weekdays, dates, time });
  }}
  onCancel={() => close()}
/>
