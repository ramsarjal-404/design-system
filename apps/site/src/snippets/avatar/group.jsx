import { Avatar, AvatarGroup } from '@lepidus/react';

// children beyond max collapse into the "+N" chip, labelled "N more"
<AvatarGroup max={3} size="md" aria-label="Contributors">
  <Avatar name="Ana Brown" />
  <Avatar name="Chen Du" />
  <Avatar name="Mary Jackson" />
  <Avatar name="Katherine Johnson" />
  <Avatar name="Dorothy Vaughan" />
</AvatarGroup>
