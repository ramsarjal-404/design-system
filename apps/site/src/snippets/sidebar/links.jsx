import { Sidebar, DashboardIcon, LogsIcon, GeneralSettingsIcon } from '@lepidus/react';

// href items render real <a> elements — history and middle-click work.
// Disabled link items drop their href and set aria-disabled.
<Sidebar
  ariaLabel="Primary"
  items={[
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard', active: true },
    { key: 'logs', label: 'Logs', icon: <LogsIcon />, href: '/logs' },
    { key: 'admin', label: 'Admin', icon: <GeneralSettingsIcon />, href: '/admin', disabled: true },
  ]}
/>
