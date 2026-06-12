import { Accordion } from '@lepidus/react';

<Accordion
  idPrefix="faq"
  items={[
    {
      id: 'audit',
      title: 'What does Lepide audit?',
      content:
        'File servers, Active Directory, Exchange, SharePoint and Microsoft 365 activity.',
    },
    {
      id: 'retention',
      title: 'How long is data retained?',
      content:
        'Retention is configurable per data source; the default policy keeps 12 months.',
    },
  ]}
/>
