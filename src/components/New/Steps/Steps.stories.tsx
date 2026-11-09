import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { StepStatus } from '@/models/step';
import { Steps, type StepsProps } from './Steps';

const InteractiveSteps = (args: StepsProps) => {
  const [currentStep, setCurrentStep] = useState(args.currentStep);

  return (
    <Steps {...args} currentStep={currentStep} onChangeStep={setCurrentStep} />
  );
};

const meta = {
  title: 'Components_2_0/Steps',
  component: Steps,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A row of numbered steps for a multi-step flow from the 2.0 design system. A step can only be entered once every step before it is valid; going back is always allowed. The active step carries `aria-current="step"`, and completed or failed steps announce their status.',
      },
    },
  },
  argTypes: {
    steps: { control: 'object', description: 'Ordered steps to render' },
    currentStep: { control: 'text', description: 'Id of the active step' },
    onChangeStep: {
      action: 'step changed',
      control: false,
      description: 'Fired with the id of the step the user may move to',
    },
    statusLabels: {
      control: 'object',
      description: 'Translated status text announced after a step name',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the list of steps',
    },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  render: InteractiveSteps,
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

export const Default: Story = {
  args: {
    ariaLabel: 'Create deployment',
    steps: [
      { id: '1', name: 'Step 1', status: StepStatus.VALID },
      { id: '2', name: 'Step 2', status: StepStatus.ERROR },
      { id: '3', name: 'Step 3' },
    ],
    currentStep: '1',
    onChangeStep: noop,
  },
};

export const CompletedStep: Story = {
  args: {
    ariaLabel: 'Create deployment',
    steps: [
      { id: '1', name: 'Step 1' },
      { id: '2', name: 'Step 2', status: StepStatus.VALID },
      { id: '3', name: 'Step 3', status: StepStatus.ERROR },
    ],
    currentStep: '1',
    onChangeStep: noop,
  },
};

export const ActiveValidStep: Story = {
  args: {
    ...CompletedStep.args,
    currentStep: '2',
  },
};

export const ActiveErrorStep: Story = {
  args: {
    ...CompletedStep.args,
    currentStep: '3',
  },
};
