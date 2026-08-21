import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useState } from 'react';
import { Checkbox, type CheckboxProps } from './Checkbox';

const InteractiveCheckbox = (args: CheckboxProps) => {
  const [value, setValue] = useState(args.isSelected);

  return <Checkbox {...args} isSelected={value} onChange={setValue} />;
};

const meta = {
  title: 'Components_2_0/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox from the 2.0 design system, built on a native checkbox input. Supports a mixed (indeterminate) state and an error state.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'The id of the underlying checkbox input',
    },
    labelProps: {
      control: 'object',
      description: 'Props of the `Label` rendered next to the control',
    },
    isSelected: {
      control: 'boolean',
      description: 'The current value of the checkbox',
    },
    isIndeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in the mixed state',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the checkbox failed validation',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback fired with the new value when toggled',
    },
    caption: {
      control: 'text',
      description: 'Caption text rendered below the label',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    labelProps: { label: 'Text' },
  },
};

export const Selected: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'selected-checkbox',
    labelProps: { label: 'Text' },
    isSelected: true,
  },
};

export const Indeterminate: Story = {
  args: {
    id: 'indeterminate-checkbox',
    labelProps: { label: 'Text' },
    isIndeterminate: true,
  },
};

export const Invalid: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'invalid-checkbox',
    labelProps: { label: 'Text' },
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    labelProps: { label: 'Text' },
    disabled: true,
  },
};

export const WithCaption: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'caption-checkbox',
    labelProps: { label: 'Text' },
    isSelected: true,
    caption: 'Some caption text',
  },
};

/**
 * The Unselected / Indeterminate / Selected × Default / Error / Disable matrix
 * from the design spec. Hover and focus are interaction states — hover a control
 * or tab to it to see them.
 */
export const AllVariants: Story = {
  args: { id: 'all-variants-checkbox' },
  render: () => {
    const columns: Pick<CheckboxProps, 'isSelected' | 'isIndeterminate'>[] = [
      {},
      { isIndeterminate: true },
      { isSelected: true },
    ];
    const rows: { title: string; props: Partial<CheckboxProps> }[] = [
      { title: 'Default', props: {} },
      { title: 'Error', props: { invalid: true } },
      { title: 'Disable', props: { disabled: true } },
    ];

    return (
      <div className="grid min-w-[420px] grid-cols-[auto_1fr_1fr_1fr] items-center gap-x-8 gap-y-6 p-8">
        <span />
        <span className="text-primary dial-small-semi-text">Unselected</span>
        <span className="text-primary dial-small-semi-text">Indeterminate</span>
        <span className="text-primary dial-small-semi-text">Selected</span>

        {rows.map((row) => (
          <Fragment key={row.title}>
            <span className="text-secondary dial-small-text whitespace-nowrap">
              {row.title}
            </span>
            {columns.map((column, index) => (
              <Checkbox
                key={`${row.title}-${index}`}
                id={`all-${row.title}-${index}`}
                labelProps={{ label: 'Text' }}
                {...column}
                {...row.props}
              />
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
};

/**
 * A parent checkbox driven by its children: mixed while some are selected,
 * selected once they all are.
 */
export const ParentChild: Story = {
  args: { id: 'parent-child-checkbox' },
  render: () => {
    const ParentChildExample = () => {
      const [selected, setSelected] = useState<string[]>(['read']);
      const permissions = ['read', 'write', 'share'];
      const allSelected = selected.length === permissions.length;

      return (
        <div className="flex min-w-[260px] flex-col gap-3 p-8">
          <Checkbox
            id="permissions-all"
            labelProps={{ label: 'All permissions' }}
            isSelected={allSelected}
            isIndeterminate={selected.length > 0 && !allSelected}
            onChange={(value) => setSelected(value ? permissions : [])}
          />
          <div className="ml-6 flex flex-col gap-3">
            {permissions.map((permission) => (
              <Checkbox
                key={permission}
                id={`permission-${permission}`}
                labelProps={{ label: permission }}
                isSelected={selected.includes(permission)}
                onChange={(value) =>
                  setSelected((current) =>
                    value
                      ? [...current, permission]
                      : current.filter((item) => item !== permission),
                  )
                }
              />
            ))}
          </div>
        </div>
      );
    };

    return <ParentChildExample />;
  },
};
