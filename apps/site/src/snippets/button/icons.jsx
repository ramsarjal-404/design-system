import { Button, PlusIcon } from '@lepidus/react';

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 4l4 4-4 4" />
  </svg>
);

<>
  {/* icons render at 16px (md) or 24px (lg) and must use currentColor */}
  <Button variant="primary" size="lg" iconLeft={<PlusIcon />}>
    Add credentials
  </Button>
  <Button variant="secondary" iconRight={<ChevronRight />}>
    Next
  </Button>
</>
