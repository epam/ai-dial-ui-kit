import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { StepStatus } from '@/models/step';
import { Steps, type StepsProps } from './Steps';

const steps = [
  { id: 'step1', name: 'Step 1', status: StepStatus.VALID },
  { id: 'step2', name: 'Step 2', status: StepStatus.ERROR },
  { id: 'step3', name: 'Step 3' },
];

const renderSteps = (props: Partial<StepsProps> = {}) => {
  const onChangeStep = vi.fn();
  render(
    <Steps
      steps={steps}
      currentStep="step1"
      onChangeStep={onChangeStep}
      {...props}
    />,
  );

  return onChangeStep;
};

describe('Dial UI Kit :: Steps', () => {
  test('renders an ordered list with a button per step', () => {
    renderSteps({ ariaLabel: 'Create deployment' });

    expect(
      screen.getByRole('list', { name: 'Create deployment' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  test('marks only the current step with aria-current', () => {
    renderSteps({ currentStep: 'step3' });

    expect(screen.getByRole('button', { name: /Step 3/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    expect(screen.getByRole('button', { name: /Step 1/ })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('announces the status after the step name', () => {
    renderSteps({ currentStep: 'step3' });

    expect(
      screen.getByRole('button', { name: 'Step 1 Completed' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Step 2 Error' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Step 3' })).toBeInTheDocument();
  });

  test('uses translated statusLabels', () => {
    renderSteps({
      currentStep: 'step3',
      statusLabels: { [StepStatus.ERROR]: 'Fehler' },
    });

    expect(
      screen.getByRole('button', { name: 'Step 2 Fehler' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Step 1 Completed' }),
    ).toBeInTheDocument();
  });

  test('moves to the next step when every previous step is valid', async () => {
    const onChangeStep = renderSteps();

    await userEvent.click(screen.getByRole('button', { name: /Step 2/ }));

    expect(onChangeStep).toHaveBeenCalledWith('step2');
  });

  test('does not move forward past an invalid step', async () => {
    const onChangeStep = renderSteps({ currentStep: 'step2' });

    await userEvent.click(screen.getByRole('button', { name: /Step 3/ }));

    expect(onChangeStep).not.toHaveBeenCalled();
  });

  test('always allows going back', async () => {
    const onChangeStep = renderSteps({ currentStep: 'step3' });

    await userEvent.click(screen.getByRole('button', { name: /Step 1/ }));

    expect(onChangeStep).toHaveBeenCalledWith('step1');
  });

  test('does not fire for the current step', async () => {
    const onChangeStep = renderSteps();

    await userEvent.click(screen.getByRole('button', { name: /Step 1/ }));

    expect(onChangeStep).not.toHaveBeenCalled();
  });

  test('merges className and stamps the public class on the root', () => {
    renderSteps({ className: 'custom' });

    expect(screen.getByRole('list')).toHaveClass(
      'custom',
      DIAL_KIT_CLASS.steps,
    );
  });
});
