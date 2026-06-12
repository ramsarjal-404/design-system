import { ActionItem, EditIcon, ShareIcon } from '@lepidus/react';

<ActionItem
  aria-label="Item actions"
  actions={[
    { id: 'edit', label: 'Edit', icon: <EditIcon />, onClick: () => openEditor() },
    { id: 'share', label: 'Share', icon: <ShareIcon />, onClick: () => share() },
  ]}
/>
