import { useState } from 'react';
import { Tag } from '@ramsarjal-404/react';

function FilterBar() {
  const [filters, setFilters] = useState(['Errors only', 'Last 24 hours', 'AD-Primary']);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {filters.map((f) => (
        <Tag
          key={f}
          variant="neutral"
          removeLabel={`Remove filter: ${f}`}
          onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
        >
          {f}
        </Tag>
      ))}
      {filters.length === 0 && <span>No filters applied</span>}
    </div>
  );
}
