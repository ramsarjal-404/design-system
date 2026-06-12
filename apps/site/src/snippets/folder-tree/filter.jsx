import { useState } from 'react';
import { FolderTree } from '@lepidus/react';

function SearchableTree({ folders }) {
  const [search, setSearch] = useState('');
  return (
    <>
      <input
        type="search"
        aria-label="Search reports"
        placeholder="Search reports"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Folders with matching reports auto-expand */}
      <FolderTree folders={folders} filter={search} />
    </>
  );
}
