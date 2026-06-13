import { Input } from '@ramsarjal-404/react';

{/* status="error" sets aria-invalid and links the message via aria-describedby */}
<Input
  label="API End Point URL"
  defaultValue="not-a-url"
  status="error"
  errorMessage="Please enter a valid Site collection URL."
  fullWidth
/>
