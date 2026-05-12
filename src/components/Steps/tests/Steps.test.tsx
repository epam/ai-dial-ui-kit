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

  it('calls onChangeStep when all previous steps are valid', () => {
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

  it('does not call onChangeStep if a previous step is not valid', () => {
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

  it('does not call onChangeStep when skipping a step with an invalid intermediate step', () => {
    const setCurrentStep = vi.fn();
    // step1=VALID, step2 not valid → clicking step3 should be blocked
    const { getByText } = render(
      <DialSteps
        steps={steps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 3'));
    expect(setCurrentStep).not.toHaveBeenCalled();
  });

  it('calls onChangeStep when all previous steps are valid and skipping forward', () => {
    const setCurrentStep = vi.fn();
    const allValidSteps = [
      { id: 'step1', name: 'Step 1', status: StepStatus.VALID },
      { id: 'step2', name: 'Step 2', status: StepStatus.VALID },
      { id: 'step3', name: 'Step 3' },
    ];
    const { getByText } = render(
      <DialSteps
        steps={allValidSteps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 3'));
    expect(setCurrentStep).toHaveBeenCalledWith('step3');
  });

  it('calls onChangeStep when a previous step is clicked (going backward)', () => {
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

  it('does not call onChangeStep when clicking the current step', () => {
    const setCurrentStep = vi.fn();
    const { getByText } = render(
      <DialSteps
        steps={steps}
        currentStep="step1"
        onChangeStep={setCurrentStep}
      />,
    );
    fireEvent.click(getByText('Step 1'));
    expect(setCurrentStep).not.toHaveBeenCalled();
  });
});
