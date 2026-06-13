import { useState } from 'react';
import { Button, Steps } from '@ramsarjal-404/react';

function Wizard() {
  const [step, setStep] = useState(1);
  return (
    <>
      <Steps total={5} current={step} onStepClick={setStep} />
      {/* …step content… */}
      <Button variant="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>
        Back
      </Button>
      <Button variant="primary" disabled={step === 5} onClick={() => setStep(step + 1)}>
        Next
      </Button>
    </>
  );
}
