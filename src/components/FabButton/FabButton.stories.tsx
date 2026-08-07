import type { Meta, StoryObj } from '@storybook/react-vite';
import { FabButton, type FabButtonProps } from './FabButton';

const meta = {
  title: 'Components_2.0/FabButton',
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

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithTooltip: Story = {
  args: {
    tooltipProps: { tooltip: 'Scroll to bottom' },
  },
};

export const TooltipAsAccessibleName: Story = {
  args: {
    'aria-label': undefined,
    tooltipProps: { tooltip: 'Scroll to bottom' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The button is icon-only, so it needs an accessible name. With no `aria-label`, a string `tooltipProps.tooltip` is used as the label — the tooltip itself is not announced by screen readers and is hidden on mobile.',
      },
    },
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
