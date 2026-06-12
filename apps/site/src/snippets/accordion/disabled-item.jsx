import { Accordion } from '@lepidus/react';

<Accordion
  idPrefix="plans"
  items={[
    {
      id: 'trial',
      title: 'Is there a free trial?',
      content: 'Every new workspace starts with a 14-day trial of the full feature set.',
    },
    {
      id: 'sla',
      title: 'Enterprise SLA (contact sales)',
      content: 'SLA details are shared during procurement.',
      disabled: true,
    },
  ]}
/>
