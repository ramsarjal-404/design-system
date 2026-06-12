import { Toast } from '@lepidus/react';

<>
  <Toast variant="success" title="Success !" onClose={dismiss}>
    your changes have been saved.
  </Toast>
  <Toast variant="warning" title="Warning !" onClose={dismiss}>
    your session is about to expire.
  </Toast>
  <Toast variant="error" title="Error !" onClose={dismiss}>
    provided credentials failed to authenticate.
  </Toast>
</>
