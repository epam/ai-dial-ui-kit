import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconPlus } from '@tabler/icons-react';

import { GhostButton } from '@/components/New/Button/ButtonWrappers';
import { Input } from '@/components/New/Input/Input';
import { Switch } from '@/components/New/Switch/Switch';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { FormSectionVariant } from '@/types/form-section';

import { FormSection, type FormSectionProps } from './FormSection';

const meta = {
  title: 'Components_2_0/FormSection',
  component: FormSection,
  tags: ['form', 'section', 'builder', 'settings', 'group'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A titled section of a form or a builder column: a heading with an optional action at its end, an optional description and the content. The root is a `section` named by its heading; `headingLevel` fits it into the page outline, `variant` sets the type scale.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] bg-layer-raised p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: { type: 'text' }, description: 'Heading' },
    description: {
      control: { type: 'text' },
      description: 'Line under the heading',
    },
    variant: {
      control: { type: 'select' },
      options: Object.values(FormSectionVariant),
      description: 'Type scale of the heading and description',
    },
    headingLevel: {
      control: { type: 'select' },
      options: [2, 3, 4, 5, 6],
      description: 'Level of the heading element',
    },
    action: {
      control: false,
      description: 'Control at the end of the heading row',
    },
    children: { control: false, description: 'The section content' },
  },
  args: {
    title: 'Name',
    description: 'Shown in the catalog and the chat header.',
    variant: FormSectionVariant.Row,
    children: <Input aria-label="Name" placeholder="My app" />,
  },
} satisfies Meta<FormSectionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {};

export const Caption: Story = {
  args: {
    title: 'Variables',
    variant: FormSectionVariant.Caption,
    description: 'Passed to the runtime as environment variables.',
    action: (
      <GhostButton
        label="Add"
        iconBefore={
          <IconPlus
            aria-hidden="true"
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
          />
        }
      />
    ),
    children: undefined,
  },
};

export const Setting: Story = {
  args: {
    title: 'Streaming',
    variant: FormSectionVariant.Setting,
    description: 'Send the answer as it is generated.',
    action: <Switch aria-label="Streaming" isOn onChange={() => undefined} />,
    children: undefined,
  },
};
