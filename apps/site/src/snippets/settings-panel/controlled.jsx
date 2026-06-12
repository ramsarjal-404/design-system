import { useState } from 'react';
import { SettingsPanel } from '@lepidus/react';

function SettingsLayout({ items }) {
  const [selected, setSelected] = useState('general');
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <SettingsPanel items={items} selectedId={selected} onSelect={setSelected} />
      <section style={{ flex: 1 }}>
        {/* render the form for `selected` here */}
      </section>
    </div>
  );
}
