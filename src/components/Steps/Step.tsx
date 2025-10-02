import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { type Step, StepStatus } from '@/models/step';
import classNames from 'classnames';
import { getCircleClass, getStepClass } from './utils';

export interface DialStepProps {
  step: Step;
  index: number;
  currentStep: string;
  handleStepChange: (step: string) => void;
}

export const DialStep: FC<DialStepProps> = ({
  step,
  index,
  currentStep,
  handleStepChange,
}) => {
  const stepClass =
    'h-[32px] flex flex-1 min-w-[180px] items-center dial-tiny border-t-2 cursor-pointer';
  const circleClass =
    'w-[22px] h-[22px] flex justify-center items-center mr-2 rounded-full text-white';

  const getContent = () => {
    if (currentStep === step.id && step.status === StepStatus.ERROR) {
      return <IconExclamationCircle stroke={2} size={16} />;
    }
    if (currentStep !== step.id && step.status === StepStatus.VALID) {
      return <IconCheck stroke={2} size={16} />;
    }

    return index + 1;
  };
  return (
    <button
      className={classNames(stepClass, getStepClass(step, currentStep))}
      onClick={() => handleStepChange(step.id)}
    >
      <span
        className={classNames(circleClass, getCircleClass(step, currentStep))}
      >
        {getContent()}
      </span>
      <span>{step.name}</span>
    </button>
  );
};
