import { Link } from '@lepidus/react';

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8h11" />
    <path d="M9 3.5 13.5 8 9 12.5" />
  </svg>
);

<Link variant="standalone" href="#all-projects" icon={<ArrowIcon />}>
  View all projects
</Link>
