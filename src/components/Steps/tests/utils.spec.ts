import { describe, it, expect } from 'vitest';
import { getStepClass, getCircleClass } from '@/components/Steps/utils';
import { StepStatus } from '@/models/step';

const baseStep = { id: 'step1', name: 'Step 1' };

describe('getStepClass', () => {
  it('returns correct class for current step with VALID status', () => {
    expect(
      getStepClass({ ...baseStep, status: StepStatus.VALID }, 'step1'),
    ).toBe('border-accent-secondary text-primary');
  });
  it('returns correct class for current step with ERROR status', () => {
    expect(
      getStepClass({ ...baseStep, status: StepStatus.ERROR }, 'step1'),
    ).toBe('border-red-900 text-primary');
  });
  it('returns correct class for current step with default status', () => {
    expect(getStepClass({ ...baseStep }, 'step1')).toBe(
      'border-accent-primary text-primary',
    );
  });
  it('returns correct class for non-current step with VALID status', () => {
    expect(
      getStepClass({ ...baseStep, status: StepStatus.VALID }, 'other'),
    ).toBe('border-primary text-primary');
  });
  it('returns correct class for non-current step with ERROR status', () => {
    expect(
      getStepClass({ ...baseStep, status: StepStatus.ERROR }, 'other'),
    ).toBe('border-red-900 text-error');
  });
  it('returns correct class for non-current step with default status', () => {
    expect(getStepClass({ ...baseStep }, 'other')).toBe(
      'border-primary text-secondary',
    );
  });
});

describe('getCircleClass', () => {
  it('returns correct class for current step with VALID status', () => {
    expect(
      getCircleClass({ ...baseStep, status: StepStatus.VALID }, 'step1'),
    ).toBe('bg-accent-secondary');
  });
  it('returns correct class for current step with ERROR status', () => {
    expect(
      getCircleClass({ ...baseStep, status: StepStatus.ERROR }, 'step1'),
    ).toBe('bg-red-400');
  });
  it('returns correct class for current step with default status', () => {
    expect(getCircleClass({ ...baseStep }, 'step1')).toBe('bg-accent-primary');
  });
  it('returns correct class for non-current step with VALID status', () => {
    expect(
      getCircleClass({ ...baseStep, status: StepStatus.VALID }, 'other'),
    ).toBe('bg-accent-secondary');
  });
  it('returns correct class for non-current step with ERROR status', () => {
    expect(
      getCircleClass({ ...baseStep, status: StepStatus.ERROR }, 'other'),
    ).toBe('bg-red-400');
  });
  it('returns correct class for non-current step with default status', () => {
    expect(getCircleClass({ ...baseStep }, 'other')).toBe('bg-layer-4');
  });
});
