import { describe, it, expect, vi } from 'vitest';
import { DialSteps } from '@/components/Steps/Steps';
import { StepStatus } from '@/models/step';
import { render, fireEvent } from '@testing-library/react';

const steps = [
  { id: 'step1', name: 'Step 1', status: StepStatus.VALID },
  { id: 'step2', name: 'Step 2', status: StepStatus.ERROR },
  { id: 'step3', name: 'Step 3' },
];

describe('Dial UI Kit :: DialSteps', () => {
  it('renders all steps', () => {
    const setCurrentStep = vi.fn();
    const { getByText } = render(
      <DialSteps
        steps={steps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    expect(getByText('Step 1')).toBeTruthy();
    expect(getByText('Step 2')).toBeTruthy();
    expect(getByText('Step 3')).toBeTruthy();
  });

  it('calls setCurrentStep when a valid next step is clicked', () => {
    const setCurrentStep = vi.fn();
    const { getByText } = render(
      <DialSteps
        steps={steps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 2'));
    expect(setCurrentStep).toHaveBeenCalledWith('step2');
  });

  it('does not call setCurrentStep if current step is not valid and clicking next', () => {
    const setCurrentStep = vi.fn();
    const invalidSteps = [
      { id: 'step1', name: 'Step 1' },
      { id: 'step2', name: 'Step 2' },
    ];
    const { getByText } = render(
      <DialSteps
        steps={invalidSteps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 2'));
    expect(setCurrentStep).not.toHaveBeenCalled();
  });

  it('calls setCurrentStep when a previous step is clicked', () => {
    const setCurrentStep = vi.fn();
    const { getByText } = render(
      <DialSteps
        steps={steps}
        currentStep="step2"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 1'));
    expect(setCurrentStep).toHaveBeenCalledWith('step1');
  });
});
