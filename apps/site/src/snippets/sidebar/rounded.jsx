import { useState } from 'react';
import { Sidebar, DashboardIcon, LogsIcon, GeneralSettingsIcon } from '@ramsarjal-404/react';

function RoundedRail() {
  const [active, setActive] = useState('dashboard');
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'logs', label: 'Logs', icon: <LogsIcon /> },
    { key: 'settings', label: 'Settings', icon: <GeneralSettingsIcon /> },
  ];
  return (
    <Sidebar
      variant="rounded"
      items={items.map((item) => ({
        ...item,
        active: item.key === active,
        onClick: () => setActive(item.key),
      }))}
    />
  );
}
