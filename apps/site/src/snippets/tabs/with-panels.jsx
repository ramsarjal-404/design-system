import { useState } from 'react';
import { Tabs } from '@lepidus/react';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'history', label: 'History' },
];

function ReportTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <>
      <Tabs tabs={TABS} value={tab} onChange={setTab} idPrefix="report" hasPanels />
      {TABS.map(({ id, label }) => (
        <div
          key={id}
          role="tabpanel"
          id={`report-panel-${id}`}
          aria-labelledby={`report-tab-${id}`}
          hidden={tab !== id}
        >
          {label} content goes here.
        </div>
      ))}
    </>
  );
}
