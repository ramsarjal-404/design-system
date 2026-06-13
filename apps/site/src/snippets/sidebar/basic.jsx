import { Sidebar, DashboardIcon, LogsIcon, GeneralSettingsIcon } from '@ramsarjal-404/react';

<Sidebar
  ariaLabel="Primary"
  header={<img src="/logo.svg" alt="Lepide" width={48} height={48} />}
  items={[
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, active: true },
    { key: 'logs', label: 'Logs', icon: <LogsIcon /> },
    { key: 'settings', label: 'Settings', icon: <GeneralSettingsIcon /> },
  ]}
/>
