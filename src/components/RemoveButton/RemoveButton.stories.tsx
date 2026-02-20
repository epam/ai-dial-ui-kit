import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialRemoveButton, type DialRemoveButtonProps } from './RemoveButton';

const meta: Meta<typeof DialRemoveButton> = {
  title: 'DIAL/Elements/Buttons/RemoveButton',
  component: DialRemoveButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A specialized delete button using a predefined trash icon (`IconTrashX`). It`s intended for destructive or removal actions and wraps the `DialButton` component.',
      },
    },
  },
  argTypes: {
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for the button',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the button',
    },
    iconClassName: {
      control: { type: 'text' },
      description: 'Optional CSS class applied to the trash icon',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked',
    },
  },
} satisfies Meta<DialRemoveButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Remove item',
    onClick: () => alert('Item removed!'),
  },
};

export const CustomIconClass: Story = {
  args: {
    'aria-label': 'Delete entry',
    iconClassName: 'text-error',
    onClick: () => alert('Deleted!'),
  },
};

export const WithCustomButtonClass: Story = {
  args: {
    'aria-label': 'Remove',
    className: 'bg-layer-3 hover:bg-error-alpha text-primary',
    onClick: () => alert('Removed!'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-y-6">
      <div className="flex flex-row items-center gap-x-4">
        <div className="text-primary min-w-[160px]">Default</div>
        <DialRemoveButton
          aria-label="Remove default"
          onClick={() => alert('Removed!')}
        />
      </div>

      <div className="flex flex-row items-center gap-x-4">
        <div className="text-primary min-w-[160px]">Error Icon</div>
        <DialRemoveButton
          aria-label="Remove error"
          iconClassName="text-error"
          onClick={() => alert('Removed!')}
        />
      </div>

      <div className="flex flex-row items-center gap-x-4">
        <div className="text-primary min-w-[160px]">Custom Button Style</div>
        <DialRemoveButton
          aria-label="Remove custom"
          className="bg-error text-white hover:bg-error-alpha"
          onClick={() => alert('Removed!')}
        />
      </div>
    </div>
  ),
};
