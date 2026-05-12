import type { FC } from 'react';

import { type Step, StepStatus } from '@/models/step';
import { DialStep } from './Step';

export interface DialStepsProps {
  steps: Step[];
  currentStep: string;
  onChangeStep: (step: string) => void;
}

/**
 * Props for the DialSteps component, which renders a multi-step navigation UI.
 * aliases: StepWizard|ProgressSteps
 *
 * @example
 * ```tsx
 * <DialSteps
 *   steps={[{ id: 'step1', label: 'Step 1', status: StepStatus.VALID }, { id: 'step2', label: 'Step 2', status: StepStatus.ERROR }]}
 *   currentStep="step1"
 *   onChangeStep={(step) => console.log(step)}
 * />
 * ```
 *
 * @param steps - Array of step objects to display
 * @param currentStep - The id of the currently active step
 * @param onChangeStep - Callback to set the current step by id
 */
export const DialSteps: FC<DialStepsProps> = ({
  steps,
  currentStep,
  onChangeStep,
}) => {
  const handleStepChange = (step: string) => {
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const targetStepIndex = steps.findIndex((s) => s.id === step);

    if (step === currentStep) return;

    const allPreviousValid = steps
      .slice(0, targetStepIndex)
      .every((s) => s.status === StepStatus.VALID);

    if (allPreviousValid || targetStepIndex < currentStepIndex) {
      onChangeStep(step);
    }
  };

  return (
    <div id="steps" className="flex gap-x-3">
      {steps.map((step, index) => {
        return (
          <DialStep
            key={step.id}
            currentStep={currentStep}
            onChangeStep={handleStepChange}
            step={step}
            index={index}
          />
        );
      })}
    </div>
  );
};
