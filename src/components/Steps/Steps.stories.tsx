import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepStatus } from '@/models/step';
import { type DialStepsProps, DialSteps } from './Steps';

const meta = {
  label: 'Components/Steps',
  component: DialSteps,
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'A steps component.' },
    },
  },
} satisfies Meta<DialStepsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { id: '1', name: 'Step 1', status: StepStatus.VALID },
      { id: '2', name: 'Step 2', status: StepStatus.ERROR },
      { id: '3', name: 'Step 3' },
    ],
    currentStep: '1',
    // eslint-disable-next-line no-console
    onChangeStep: (step) => console.log('Step changed to:', step),
  },
};

export const CompletedStep: Story = {
  args: {
    steps: [
      { id: '1', name: 'Step 1' },
      { id: '2', name: 'Step 2', status: StepStatus.VALID },
      { id: '3', name: 'Step 3', status: StepStatus.ERROR },
    ],
    currentStep: '1',
    // eslint-disable-next-line no-console
    onChangeStep: (step) => console.log('Step changed to:', step),
  },
};

export const ActiveErrorStep: Story = {
  args: {
    steps: [
      { id: '1', name: 'Step 1' },
      { id: '2', name: 'Step 2', status: StepStatus.VALID },
      { id: '3', name: 'Step 3', status: StepStatus.ERROR },
    ],
    currentStep: '3',
    // eslint-disable-next-line no-console
    onChangeStep: (step) => console.log('Step changed to: ', step),
  },
};

export const AllVariants: Story = {
  args: {
    steps: [
      { id: '1', name: 'Step 1' },
      { id: '2', name: 'Step 2', status: StepStatus.VALID },
      { id: '3', name: 'Step 3', status: StepStatus.ERROR },
    ],
    currentStep: '3',
    // eslint-disable-next-line no-console
    onChangeStep: (step) => console.log('Step changed to:', step),
  },
  render: () => (
    <div className="min-w-[800px] p-8 flex flex-col gap-y-6">
      {/* Default */}
      <div>
        <div className="text-primary font-semibold mb-2">Default</div>
        <DialSteps
          steps={[
            { id: '1', name: 'Step 1', status: StepStatus.VALID },
            { id: '2', name: 'Step 2', status: StepStatus.ERROR },
            { id: '3', name: 'Step 3' },
          ]}
          currentStep="3"
          // eslint-disable-next-line no-console
          onChangeStep={(step) => console.log('Step changed to:', step)}
        />
      </div>

      {/* Completed Step */}
      <div>
        <div className="text-primary font-semibold mb-2">Completed Step</div>
        <DialSteps
          steps={[
            { id: '1', name: 'Step 1' },
            { id: '2', name: 'Step 2', status: StepStatus.VALID },
            { id: '3', name: 'Step 3', status: StepStatus.ERROR },
          ]}
          currentStep="3"
          // eslint-disable-next-line no-console
          onChangeStep={(step) => console.log('Step changed to:', step)}
        />
      </div>

      {/* Active Error Step */}
      <div>
        <div className="text-primary font-semibold mb-2">Active Error Step</div>
        <DialSteps
          steps={[
            { id: '1', name: 'Step 1' },
            { id: '2', name: 'Step 2', status: StepStatus.VALID },
            { id: '3', name: 'Step 3', status: StepStatus.ERROR },
          ]}
          currentStep="3"
          // eslint-disable-next-line no-console
          onChangeStep={(step) => console.log('Step changed to:', step)}
        />
      </div>
    </div>
  ),
};
