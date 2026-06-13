import { FolderTree } from '@ramsarjal-404/react';

const folders = [
  {
    id: 'ad',
    label: 'Active Directory',
    items: [
      { id: 'ad-1', label: 'User Modifications' },
      { id: 'ad-2', label: 'Group Membership Changes' },
    ],
  },
  {
    id: 'fs',
    label: 'File Server',
    items: [{ id: 'fs-1', label: 'File Read Events' }],
  },
];

<FolderTree folders={folders} defaultExpandedIds={['ad']} />
