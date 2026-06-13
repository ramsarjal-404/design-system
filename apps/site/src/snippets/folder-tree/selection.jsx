import { useState } from 'react';
import { FolderTree } from '@ramsarjal-404/react';

function ReportPicker({ folders }) {
  const [selected, setSelected] = useState();
  return (
    <FolderTree
      folders={folders}
      defaultExpandedIds={['ad']}
      selectedItemId={selected}
      onItemSelect={(itemId, folderId) => {
        setSelected(itemId);
        loadReport(folderId, itemId);
      }}
    />
  );
}
