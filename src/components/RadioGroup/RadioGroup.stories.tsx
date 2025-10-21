import { RadioGroupOrientation } from '@/types/radio-group';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { DialRadioGroup, type DialRadioGroupProps } from './RadioGroup';

const meta = {
  title: 'Form/RadioGroup',
  component: DialRadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Groups multiple radio options and renders custom content for the active option. Uses DialField as the field label and a container with role="radiogroup". Content provided in radioButtons[].content is shown under the currently active radio.',
      },
    },
  },
  argTypes: {
    fieldTitle: {
      control: { type: 'text' },
      description: 'Optional label rendered by DialField',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    elementId: {
      control: { type: 'text' },
      description:
        'Name for the underlying radio group; also used for input name',
      table: {
        type: { summary: 'string' },
      },
    },
    radioCssClass: {
      control: { type: 'text' },
      description: 'Additional classes applied to each radio input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    labelCssClass: {
      control: { type: 'text' },
      description: 'Additional classes applied to each radio label',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    containerCssClass: {
      control: { type: 'text' },
      description: 'Additional classes applied to the outer container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    selectedItemCssClass: {
      control: { type: 'text' },
      description:
        "Additional classes applied to the selected option's content container",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    selectedLabelCssClass: {
      control: { type: 'text' },
      description: "Additional classes applied to the selected option's label",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    radioGroupCssClass: {
      control: { type: 'text' },
      description: 'Additional classes applied to the radio group container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    inputContainerCssClass: {
      control: { type: 'text' },
      description: "Additional classes applied to each radio input's container",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables all child radios when set',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    activeRadioButton: {
      control: { type: 'text' },
      description: 'The id of the currently selected radio',
      table: {
        type: { summary: 'string' },
      },
    },
    orientation: {
      control: { type: 'radio' },
      options: [RadioGroupOrientation.Row, RadioGroupOrientation.Column],
      description: 'Layout direction of radios: row or column',
      table: {
        type: { summary: 'RadioGroupOrientation' },
        defaultValue: { summary: 'RadioGroupOrientation.Row' },
      },
    },
    radioButtons: {
      control: false,
      description: 'Array of options with ids, labels, and optional content',
      table: {
        type: { summary: 'RadioButtonWithContent[]' },
      },
    },
    onChange: {
      control: false,
      description: 'Callback fired with the selected radio id',
      table: {
        type: { summary: '(radioId: string) => void' },
      },
    },
  },
  args: {
    fieldTitle: 'Attachments',
    elementId: 'attachments',
    radioCssClass: undefined,
    labelCssClass: undefined,
    containerCssClass: undefined,
    selectedItemCssClass: undefined,
    radioGroupCssClass: undefined,
    inputContainerCssClass: undefined,
    disabled: false,
    activeRadioButton: 'none',
    orientation: RadioGroupOrientation.Row,
    radioButtons: [
      {
        id: 'none',
        name: '— None —',
        content: <div className="tiny text-secondary">No extras</div>,
      },
      {
        id: 'all',
        name: 'All attachments',
        content: <div className="tiny text-secondary">Everything included</div>,
      },
    ],
  },
} satisfies Meta<DialRadioGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const RowExample = (args: JSX.IntrinsicAttributes & DialRadioGroupProps) => {
  const [activeRadioButton, setActiveRadioButton] = useState(
    args.activeRadioButton,
  );

  return (
    <DialRadioGroup
      {...args}
      activeRadioButton={activeRadioButton}
      onChange={(id) => {
        setActiveRadioButton(id);
        args.onChange?.(id);
      }}
    />
  );
};
export const Row: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default horizontal layout with radio buttons displayed in a row.',
      },
    },
  },
  render: RowExample,
  args: {
    onChange: () => null,
  },
};

const ColumnExample = (args: JSX.IntrinsicAttributes & DialRadioGroupProps) => {
  const [activeRadioButton, setActiveRadioButton] = useState(
    args.activeRadioButton,
  );

  return (
    <DialRadioGroup
      {...args}
      activeRadioButton={activeRadioButton}
      onChange={(id) => {
        setActiveRadioButton(id);
        args.onChange?.(id);
      }}
    />
  );
};
export const Column: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with radio buttons stacked in a column.',
      },
    },
  },
  render: ColumnExample,
  args: {
    orientation: RadioGroupOrientation.Column,
    onChange: () => null,
  },
};

export const DisabledGroup: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled state of the radio group.',
      },
    },
  },
  args: {
    disabled: true,
    activeRadioButton: 'all',
    onChange: () => null,
  },
};

const ControlledExample = () => {
  const [active, setActive] = useState<'pickup' | 'courier'>('pickup');
  return (
    <DialRadioGroup
      fieldTitle="Delivery"
      elementId="delivery"
      orientation={RadioGroupOrientation.Column}
      activeRadioButton={active}
      radioButtons={[
        {
          id: 'pickup',
          name: 'Pickup',
          content: (
            <div className="dial-tiny text-secondary">Free, ready today</div>
          ),
        },
        {
          id: 'courier',
          name: 'Courier',
          content: (
            <div className="dial-tiny text-secondary">Arrives tomorrow</div>
          ),
        },
      ]}
      onChange={(id) => setActive(id as typeof active)}
    />
  );
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of a controlled RadioGroup component.',
      },
    },
  },
  render: ControlledExample,
  args: {
    onChange: () => null,
  },
};

const ManyOptionsExample = (
  args: JSX.IntrinsicAttributes & DialRadioGroupProps,
) => {
  const [activeRadioButton, setActiveRadioButton] = useState(
    args.activeRadioButton,
  );

  return (
    <DialRadioGroup
      {...args}
      activeRadioButton={activeRadioButton}
      onChange={(id) => {
        setActiveRadioButton(id);
        args.onChange?.(id);
      }}
    />
  );
};
export const ManyOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a radio group with multiple options in column layout.',
      },
    },
  },
  render: ManyOptionsExample,
  args: {
    elementId: 'plans',
    fieldTitle: 'Plan',
    orientation: RadioGroupOrientation.Column,
    activeRadioButton: 'team',
    onChange: () => null,
    radioButtons: [
      {
        id: 'free',
        name: 'Free',
        content: <div className="tiny text-secondary">Personal usage</div>,
      },
      {
        id: 'team',
        name: 'Team',
        content: (
          <div className="tiny text-secondary">
            Collaboration for small teams
          </div>
        ),
      },
      {
        id: 'business',
        name: 'Business',
        content: <div className="tiny text-secondary">Security and SSO</div>,
      },
    ],
  },
};

const AllCssClassesExample = (
  args: JSX.IntrinsicAttributes & DialRadioGroupProps,
) => {
  const [activeRadioButton, setActiveRadioButton] = useState(
    args.activeRadioButton,
  );

  return (
    <DialRadioGroup
      {...args}
      activeRadioButton={activeRadioButton}
      selectedLabelCssClass={
        activeRadioButton === 'premium'
          ? 'dial-h1 text-warning'
          : 'dial-h1 text-accent-tertiary'
      }
      selectedItemCssClass={
        activeRadioButton === 'premium'
          ? 'mt-2 p-3 bg-layer-1 border border-accent-primary rounded-md text-warning'
          : undefined
      }
      onChange={(id) => {
        setActiveRadioButton(id);
        args.onChange?.(id);
      }}
    />
  );
};
export const AllCssClasses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstration of all available CSS customization options. Shows containerCssClass, labelCssClass, radioGroupCssClass, inputContainerCssClass, radioCssClass, selectedLabelCssClass and selectedItemCssClass in action.',
      },
    },
  },
  render: AllCssClassesExample,
  args: {
    elementId: 'styling-demo',
    fieldTitle: 'CSS Classes Demonstration',
    orientation: RadioGroupOrientation.Column,
    activeRadioButton: 'premium',
    containerCssClass:
      'p-6 bg-layer-2 border-2 border-dashed border-accent-primary rounded-lg',
    labelCssClass: 'dial-h1 text-accent-tertiary',
    radioGroupCssClass:
      'bg-layer-1 p-4 rounded-md shadow border border-primary',
    inputContainerCssClass:
      'mb-3 p-3 bg-layer-0 rounded-md border-l-4 border-accent-primary',
    radioCssClass:
      'w-5 h-5 text-accent-primary focus:ring-accent-primary focus:ring-2 border-2 border-accent-primary',
    onChange: () => null,
    radioButtons: [
      {
        id: 'basic',
        name: 'Basic Plan',
        content: (
          <div className="dial-small">
            <div className="dial-small-semi text-success">$9/month</div>
            <div className="text-secondary">Perfect for getting started</div>
            <ul className="mt-1 dial-tiny text-secondary">
              <li>• 5 projects</li>
              <li>• Basic support</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        content: (
          <div className="dial-small">
            <div className="dial-small-semi text-accent-primary">$29/month</div>
            <div className="text-secondary">Most popular choice</div>
            <ul className="mt-1 dial-tiny text-secondary">
              <li>• Unlimited projects</li>
              <li>• Priority support</li>
              <li>• Advanced features</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        content: (
          <div className="dial-small">
            <div className="dial-small-semi text-accent-tertiary">
              Custom pricing
            </div>
            <div className="text-secondary">For large organizations</div>
            <ul className="mt-1 dial-tiny text-secondary">
              <li>• Everything in Premium</li>
              <li>• Dedicated support</li>
              <li>• Custom integrations</li>
              <li>• SLA guarantee</li>
            </ul>
          </div>
        ),
      },
    ],
  },
};
