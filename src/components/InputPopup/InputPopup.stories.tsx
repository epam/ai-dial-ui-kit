import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialButton } from '@/components/Button/Button';
import { DialInputPopup, type DialInputPopupProps } from './InputPopup';
import { DialPopup } from '@/components/Popup/Popup';

const InteractiveInputModal = (args: DialInputPopupProps) => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | string[]>(
    args.selectedValue || '',
  );

  const handleOpenModal = () => setModalState(true);
  const handleCloseModal = () => setModalState(false);

  return (
    <div className="rounded-md w-[320px]">
      <DialInputPopup
        {...args}
        open={modalState}
        selectedValue={selectedValue}
        onOpen={handleOpenModal}
        emptyValueText="None"
      >
        <DialPopup open onClose={handleCloseModal} title="Select value">
          <div className="rounded-lg p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {['Option 1', 'Option 2', 'Option 3'].map((opt) => (
                <button
                  key={opt}
                  className="border rounded p-2 text-left"
                  onClick={() => {
                    setSelectedValue(opt);
                    handleCloseModal();
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <DialButton
              title="Close"
              onClick={handleCloseModal}
              cssClass="mt-2 self-end text-primary"
            />
          </div>
        </DialPopup>
      </DialInputPopup>
    </div>
  );
};

const meta: Meta<typeof DialInputPopup> = {
  title: 'Components/InputPopup',
  component: DialInputPopup,
  tags: ['modal', 'input', 'form'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An input field that opens a modal (popup) when clicked. Displays a selected value or list of values and optionally shows errors or disabled state. The modal content is rendered using a portal.',
      },
    },
  },
  argTypes: {
    open: {
      control: false,
      description: 'Controls whether the modal is open or closed',
    },
    selectedValue: {
      control: { type: 'object' },
      description: 'Selected value or array of values displayed in the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interactivity and hides the open button',
    },
    valueCssClasses: {
      control: { type: 'text' },
      description: 'Custom CSS classes for the displayed value text',
    },
    inputCssClasses: {
      control: { type: 'text' },
      description: 'Custom CSS classes for the input wrapper',
    },
    elementId: {
      control: { type: 'text' },
      description: 'Optional ID for the input button element',
    },
    errorText: {
      control: { type: 'text' },
      description: 'Displays error text below the input when provided',
    },
    onOpen: {
      action: 'open',
      control: false,
      description: 'Callback fired when user clicks to open modal',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveInputModal,
  args: {
    selectedValue: '',
  },
};

export const WithPreselectedValue: Story = {
  render: InteractiveInputModal,
  args: {
    selectedValue: 'Option 2',
  },
};

export const MultipleValues: Story = {
  render: InteractiveInputModal,
  args: {
    selectedValue: ['Tag A', 'Tag B', 'Tag C'],
  },
};

export const Disabled: Story = {
  render: InteractiveInputModal,
  args: {
    selectedValue: 'Disabled Value',
    disabled: true,
  },
};

export const WithError: Story = {
  render: InteractiveInputModal,
  args: {
    selectedValue: '',
    errorText: 'This field is required',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[400px] text-primary">
      <div>
        <h4 className="text-lg font-semibold mb-2">Default</h4>
        <InteractiveInputModal
          selectedValue=""
          emptyValueText="None"
          onOpen={() => null}
        >
          <div />
        </InteractiveInputModal>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Preselected</h4>
        <InteractiveInputModal
          selectedValue="Option 1"
          emptyValueText="None"
          onOpen={() => null}
        >
          <div />
        </InteractiveInputModal>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Multiple</h4>
        <InteractiveInputModal
          selectedValue={['One', 'Two', 'Three']}
          emptyValueText="None"
          onOpen={() => null}
        >
          <div />
        </InteractiveInputModal>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Readonly</h4>
        <InteractiveInputModal
          selectedValue="Static Value"
          emptyValueText="None"
          disabled={true}
          onOpen={() => null}
        >
          <div />
        </InteractiveInputModal>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">With Error</h4>
        <InteractiveInputModal
          selectedValue=""
          errorText="Selection is required"
          emptyValueText="None"
          onOpen={() => null}
        >
          <div />
        </InteractiveInputModal>
      </div>
    </div>
  ),
};
