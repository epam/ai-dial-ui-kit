import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { type Step, StepStatus } from '@/models/step';
import { mergeClasses } from '@/utils/merge-classes';

export interface StepsProps {
  /** Ordered steps to render. */
  steps: Step[];
  /** `id` of the active step. */
  currentStep: string;
  /** Fired with the `id` of the step the user may move to. */
  onChangeStep: (step: string) => void;
  /**
   * Already-translated text announced for a step's status, appended to the
   * step's accessible name. Defaults to `'Completed'` / `'Error'`.
   */
  statusLabels?: Partial<Record<StepStatus, string>>;
  /** Accessible name for the list of steps. */
  ariaLabel?: string;
  /** Additional CSS classes for the root element. */
  className?: string;
}

const DEFAULT_STATUS_LABELS: Record<StepStatus, string> = {
  [StepStatus.VALID]: 'Completed',
  [StepStatus.ERROR]: 'Error',
};

const getStepClass = (step: Step, isCurrent: boolean) => {
  if (step.status === StepStatus.ERROR) {
    return isCurrent ? 'border-error text-primary' : 'border-error text-error';
  }
  if (isCurrent) {
    return step.status === StepStatus.VALID
      ? 'border-success text-primary'
      : 'border-accent text-primary';
  }

  return step.status === StepStatus.VALID
    ? 'border-primary text-primary'
    : 'border-primary text-secondary';
};

const getCircleClass = (step: Step, isCurrent: boolean) => {
  if (step.status === StepStatus.ERROR) {
    return 'bg-control-error text-control-permanent';
  }
  if (step.status === StepStatus.VALID && !isCurrent) {
    return 'bg-success text-success';
  }
  if (isCurrent) {
    return step.status === StepStatus.VALID
      ? 'bg-success text-success'
      : 'bg-control-accent text-control-permanent';
  }

  return 'bg-layer-sunken text-secondary';
};

/**
 * A row of numbered steps for a multi-step flow, marking the active one and
 * flagging completed and failed steps.
 * aliases: StepWizard|ProgressSteps|Stepper
 * Design system 2.0
 *
 * A step's number turns into a check once it is completed and the user has moved
 * on, and into an alert icon while a failed step is the active one. A step can
 * only be entered when every step before it is `StepStatus.VALID`; going back is
 * always allowed.
 *
 * The list is an ordered list, the active step carries `aria-current="step"`,
 * and a completed or failed step announces its status after its name.
 *
 * @example
 * ```tsx
 * <Steps
 *   ariaLabel="Create deployment"
 *   steps={[
 *     { id: 'general', name: 'General', status: StepStatus.VALID },
 *     { id: 'limits', name: 'Limits', status: StepStatus.ERROR },
 *     { id: 'review', name: 'Review' },
 *   ]}
 *   currentStep="general"
 *   onChangeStep={setCurrentStep}
 * />
 * ```
 *
 * @param steps - Ordered steps to render.
 * @param currentStep - `id` of the active step.
 * @param onChangeStep - Fired with the `id` of the step the user may move to.
 * @param [statusLabels] - Translated status text announced after a step's name.
 * @param [ariaLabel] - Accessible name for the list of steps.
 * @param [className] - Additional CSS classes for the root element.
 */
export const Steps: FC<StepsProps> = ({
  steps,
  currentStep,
  onChangeStep,
  statusLabels,
  ariaLabel,
  className,
}) => {
  const handleStepChange = (stepId: string) => {
    if (stepId === currentStep) return;

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const targetStepIndex = steps.findIndex((s) => s.id === stepId);

    const allPreviousValid = steps
      .slice(0, targetStepIndex)
      .every((s) => s.status === StepStatus.VALID);

    if (allPreviousValid || targetStepIndex < currentStepIndex) {
      onChangeStep(stepId);
    }
  };

  return (
    <ol
      aria-label={ariaLabel}
      className={mergeClasses(
        'm-0 flex list-none gap-x-3 p-0',
        className,
        DIAL_KIT_CLASS.steps,
      )}
    >
      {steps.map((step, index) => {
        const isCurrent = currentStep === step.id;
        const statusLabel = step.status
          ? (statusLabels?.[step.status] ?? DEFAULT_STATUS_LABELS[step.status])
          : undefined;

        let content: ReactNode = index + 1;
        if (isCurrent && step.status === StepStatus.ERROR) {
          content = (
            <IconExclamationCircle
              aria-hidden="true"
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
            />
          );
        } else if (!isCurrent && step.status === StepStatus.VALID) {
          content = (
            <IconCheck
              aria-hidden="true"
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
            />
          );
        }

        return (
          <li key={step.id} className="flex min-w-[180px] flex-1">
            <button
              type="button"
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => handleStepChange(step.id)}
              className={mergeClasses(
                'flex h-8 w-full cursor-pointer items-center border-t-2 text-start dial-tiny-text',
                'focus-visible:outline focus-visible:outline-focus',
                getStepClass(step, isCurrent),
              )}
            >
              <span
                aria-hidden="true"
                className={mergeClasses(
                  'me-2 flex size-[22px] shrink-0 items-center justify-center rounded-full',
                  getCircleClass(step, isCurrent),
                )}
              >
                {content}
              </span>
              <span>{step.name}</span>
              {statusLabel && <span className="sr-only">{statusLabel}</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
};
