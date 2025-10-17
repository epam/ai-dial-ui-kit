import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialSelectField, type DialSelectFieldProps } from './SelectField';

const meta = {
  title: 'Form/SelectField',
  component: DialSelectField,
  parameters: { layout: 'centered' },
  argTypes: {
    fieldTitle: { control: 'text' },
    optional: { control: 'boolean' },
    description: { control: 'text' },
    captionDescription: { control: 'text' },
    error: { control: 'text' },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    selectAll: { control: 'boolean' },
    selectAllLabel: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    selectCssClass: { control: 'text' },
    containerCssClass: { control: 'text' },
    readonly: { control: 'boolean' },
    defaultEmptyText: { control: 'text' },
    value: { control: 'object' },
  },
  args: {
    elementId: 'transport',
    fieldTitle: 'Transport',
    placeholder: 'Pick transport',
    options: [
      { value: 'SSE', label: 'Server-Sent Events (SSE)' },
      { value: 'WS', label: 'WebSocket' },
      { value: 'LP', label: 'Long Polling' },
    ],
  },
} satisfies Meta<DialSelectFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string>('WS');
    return (
      <div className="w-[320px]">
        <DialSelectField
          {...args}
          value={value}
          onChange={(v) => setValue(v as string)}
        />
      </div>
    );
  },
};

export const MultipleSearchable: Story = {
  args: {
    multiple: true,
    searchable: true,
    selectAll: true,
    captionDescription: 'Select one or more transports.',
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string[]>(['SSE']);
    return (
      <div className="w-[420px]">
        <DialSelectField
          {...args}
          value={value}
          onChange={(v) => setValue(v as string[])}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: { error: 'Selection required' },
  render: (args) => (
    <div className="w-[320px]">
      <DialSelectField {...args} />
    </div>
  ),
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'WS',
  },
  render: (args) => (
    <div className="w-[320px]">
      <DialSelectField {...args} />
    </div>
  ),
};

export const ReadonlyMultiple: Story = {
  args: {
    readonly: true,
    multiple: true,
    value: ['SSE', 'LP'],
    defaultEmptyText: 'No transports selected',
  },
  render: (args) => (
    <div className="w-[420px]">
      <DialSelectField {...args} />
    </div>
  ),
};
