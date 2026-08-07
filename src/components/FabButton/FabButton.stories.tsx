import type { Meta, StoryObj } from '@storybook/react-vite';
import { FabButton, type FabButtonProps } from './FabButton';

const meta = {
  title: 'Components_2_0/FabButton',
  component: FabButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Floating Action Button (FAB) — circular icon button for primary actions. Inherits all `ButtonHTMLAttributes<HTMLButtonElement>` properties.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Icon to display inside the button',
    },
  },
  args: {
    disabled: false,
    'aria-label': 'Scroll to bottom',
  },
} satisfies Meta<FabButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTooltip: Story = {
  args: {
    tooltipProps: { tooltip: 'Scroll to bottom' },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          { label: 'Default', id: 'btn-default', disabled: false },
          { label: 'Hover', id: 'btn-hover', disabled: false },
          { label: 'Active', id: 'btn-active', disabled: false },
          { label: 'Focus', id: 'btn-focus', disabled: false },
          { label: 'Disable', id: 'btn-disable', disabled: true },
        ] satisfies { label: string; id: string; disabled: boolean }[]
      ).map(({ label, id, disabled }) => (
        <div key={id} className="flex flex-row items-center gap-6">
          <span className="w-14 text-right text-sm text-secondary">
            {label}
          </span>
          <FabButton id={id} aria-label={label} disabled={disabled} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: '#btn-hover',
      active: '#btn-active',
      focusVisible: '#btn-focus',
    },
  },
};
