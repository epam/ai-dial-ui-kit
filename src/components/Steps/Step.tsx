import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { type Step, StepStatus } from '@/models/step';
import classNames from 'classnames';
import { getCircleClass, getStepClass } from './utils';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export interface DialStepProps {
  step: Step;
  index: number;
  currentStep: string;
  onChangeStep: (step: string) => void;
}

export const DialStep: FC<DialStepProps> = ({
  step,
  index,
  currentStep,
  onChangeStep,
}) => {
  const stepClass =
    'h-[32px] flex flex-1 min-w-[180px] items-center dial-tiny cursor-pointer dial-step';
  const circleClass =
    'w-[22px] h-[22px] flex justify-center items-center mr-2 rounded-full text-white';

  const getContent = () => {
    if (currentStep === step.id && step.status === StepStatus.ERROR) {
      return <IconExclamationCircle stroke={2} size={DIAL_ICON_SIZE.SM} />;
    }
    if (currentStep !== step.id && step.status === StepStatus.VALID) {
      return <IconCheck stroke={2} size={DIAL_ICON_SIZE.SM} />;
    }

    return index + 1;
  };
  return (
    <button
      className={classNames(stepClass, getStepClass(step, currentStep))}
      onClick={() => onChangeStep(step.id)}
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
