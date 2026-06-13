import { Filter } from '@ramsarjal-404/react';

<Filter
  open={open}
  title="Refine results"
  width={480}
  criteriaOptions={['Equals', 'Contains']} // subset of the helper-supported criteria
  fields={[
    { id: 'whoModified', label: 'Who Modified', values: ['LPDE\\administrator', 'LPDE\\d.murphy'] },
  ]}
  onApply={(conditions) => commit(conditions)}
  onCancel={() => setOpen(false)}
/>
