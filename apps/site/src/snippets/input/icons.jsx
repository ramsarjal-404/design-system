import { Input, SearchIcon, DropDownIcon } from '@ramsarjal-404/react';

{/* icon slots render 18×18 SVGs in placeholder gray; keep them aria-hidden */}
<Input
  label="Find server"
  labelPosition="top"
  placeholder="Search by name"
  iconLeft={<SearchIcon />}
  iconRight={<DropDownIcon />}
/>
