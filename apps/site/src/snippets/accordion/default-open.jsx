import { Accordion } from '@lepidus/react';

<Accordion
  idPrefix="orders"
  defaultValue={['shipping']}
  items={[
    {
      id: 'shipping',
      title: 'Shipping details',
      content: 'Orders placed before 2pm ship the same business day.',
    },
    {
      id: 'returns',
      title: 'Returns & exchanges',
      content: 'Items can be returned within 30 days of delivery in their original packaging.',
    },
  ]}
/>
