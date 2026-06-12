import { Message } from '@lepidus/react';

<Message
  variant="error"
  title="The network path was not found"
  primaryAction={{ label: 'Ok', onClick: retry }}
  secondaryAction={{ label: 'Cancel', onClick: cancel }}
  onClose={dismiss}
>
  {'Possible Solution :\nIf you have not provided full username (username@domainame) then try with full user name.\nMake sure you are entering correct password.'}
</Message>
