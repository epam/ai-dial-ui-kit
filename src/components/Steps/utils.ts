import { StepStatus, type Step } from '@/models/step';

export const getStepClass = (step: Step, currentStepId: string) => {
  if (currentStepId === step.id) {
    switch (step.status) {
      case StepStatus.VALID:
        return 'border-accent-secondary text-primary';
      case StepStatus.ERROR:
        return 'border-red-900 text-primary';
      default:
        return 'border-accent-primary text-primary';
    }
  }

  switch (step.status) {
    case StepStatus.VALID:
      return 'border-primary text-white';
    case StepStatus.ERROR:
      return 'border-red-900 text-error';
    default:
      return 'border-primary text-secondary';
  }
};

export const getCircleClass = (step: Step, currentStepId: string) => {
  if (currentStepId === step.id) {
    switch (step.status) {
      case StepStatus.VALID:
        return 'bg-accent-secondary';
      case StepStatus.ERROR:
        return 'bg-red-400';
      default:
        return 'bg-accent-primary';
    }
  }

  switch (step.status) {
    case StepStatus.VALID:
      return 'bg-accent-secondary';
    case StepStatus.ERROR:
      return 'bg-red-400';
    default:
      return 'bg-layer-4';
  }
};
