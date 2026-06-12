import {
  SettingsPanel,
  GeneralSettingsIcon,
  LogsIcon,
  BackupRestoreIcon,
} from '@lepidus/react';

<SettingsPanel
  defaultSelectedId="general"
  items={[
    { id: 'general', label: 'General Settings', icon: <GeneralSettingsIcon size={30} /> },
    { id: 'logs', label: 'Logs', icon: <LogsIcon size={30} /> },
    { id: 'backup', label: 'Backup & Restore', icon: <BackupRestoreIcon size={30} /> },
  ]}
/>
