import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { DialFormItem, type DialFormItemProps } from './FormItem';

import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import { DialInput } from '@/components/Input/Input';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';
import { DialSelect } from '@/components/Select/Select';
import { FormItemOrientation } from '@/types/form-item';
import { dialFormItemBaseArgTypes } from '@/constants/storybook/form-item';

interface Option {
  label: string;
  value: string;
}

const meta = {
  title: 'Form/FormItem',
  component: DialFormItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FormItem is a wrapper component that allows to add labels, descriptions, captions, error messages, optional field indicators, and both vertical and horizontal layouts.',
      },
    },
  },
  argTypes: {
    id: {
      control: { type: 'text' as const },
      description: 'The unique identifier for the form element',
    },
    labelVisuallyHidden: {
      control: { type: 'boolean' as const },
      description: 'Whether to visually hide the label',
    },
    className: {
      control: { type: 'text' as const },
      description: 'Additional CSS classes for the form item container',
    },
    childrenClassName: {
      control: { type: 'text' as const },
      description: 'Additional CSS classes for the children wrapper',
    },
    labelClassName: {
      control: { type: 'text' as const },
      description: 'Additional CSS classes for the label',
    },
    errorClassName: {
      control: { type: 'text' as const },
      description: 'Additional CSS classes for the error message',
    },
    ...dialFormItemBaseArgTypes,
  },
  args: {
    id: 'field',
    label: 'Field label',
    orientation: FormItemOrientation.Vertical,
  },
} satisfies Meta<DialFormItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const transportOptions: Option[] = [
  { label: 'Server-Sent Events (SSE)', value: 'SSE' },
  { label: 'WebSocket', value: 'WS' },
  { label: 'Long Polling', value: 'LP' },
];

const BasicFormExample = (args: DialFormItemProps) => {
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <form
      className="w-[520px] max-w-full space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        alert(`Submit: ${JSON.stringify({ name, agree })}`);
      }}
    >
      <DialFormItem
        {...args}
        id="name"
        label="Name"
        description="Type your full name."
        captionDescription="This is additional caption text."
      >
        <DialInput
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(name) => setName(name ?? '')}
        />
      </DialFormItem>

      <DialFormItem
        id="agree"
        label="Terms"
        required
        description="You must accept the terms to proceed."
      >
        <DialCheckbox
          id="agree"
          label="I accept the terms"
          checked={agree}
          onChange={(v) => setAgree(Boolean(v))}
        />
      </DialFormItem>
      <DialPrimaryButton type="submit" label="Submit" />
    </form>
  );
};

const WithValidationExample = (args: DialFormItemProps) => {
  const [email, setEmail] = useState('');
  const isValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email],
  );

  return (
    <form
      className="w-[520px] max-w-full space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        alert(`Invite sent to ${email}`);
      }}
    >
      <DialFormItem
        {...args}
        id="email"
        label="Email"
        description="We will send an invitation link."
        captionDescription="Make sure to enter a valid email address."
        error={!isValid && email ? 'Enter a valid email' : undefined}
      >
        <DialInput
          id="email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(value) => setEmail(value ?? '')}
          invalid={email.length > 0 && !isValid}
        />
      </DialFormItem>

      <DialPrimaryButton
        type="submit"
        label="Send Invite"
        disabled={!isValid}
      />
    </form>
  );
};

const SelectBasicExample = (args: DialFormItemProps) => {
  const [transport, setTransport] = useState<string | string[]>('SSE');

  function handleTransportChange(value: string | string[]): void {
    setTransport(value);
  }

  return (
    <form
      className="w-[520px] max-w-full space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        alert(`Transport: ${transport}`);
      }}
    >
      <DialFormItem
        {...args}
        id="transport"
        label="Transport"
        description="Select your preferred transport type."
        className="w-[160px]"
      >
        <DialSelect
          value={transport}
          options={transportOptions}
          onChange={handleTransportChange}
          placeholder="Pick transport"
        />
      </DialFormItem>

      <DialPrimaryButton type="submit" label="Save" />
    </form>
  );
};

const SelectHorizontalExample = (args: DialFormItemProps) => {
  const [transport, setTransport] = useState<string | string[]>('WS');

  function handleTransportChange(value: string | string[]): void {
    setTransport(value);
  }

  return (
    <form
      className="w-[520px] max-w-full space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        alert(`Transport: ${transport}`);
      }}
    >
      <DialFormItem
        {...args}
        id="transport-h"
        label="Transport"
        orientation={FormItemOrientation.Horizontal}
        labelClassName="w-32 mt-1"
        description="Horizontal layout with label on the left."
      >
        <DialSelect
          value={transport}
          options={transportOptions}
          onChange={handleTransportChange}
        />
      </DialFormItem>

      <DialPrimaryButton type="submit" label="Save" />
    </form>
  );
};

const SelectWithValidationExample = (args: DialFormItemProps) => {
  const [transport, setTransport] = useState<string | string[]>('');
  const [name, setName] = useState('');

  function handleTransportChange(value: string | string[]): void {
    setTransport(value);
  }

  const isValid = Boolean(transport && name);

  return (
    <form
      className="w-[520px] max-w-full space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        alert(`Create with: ${JSON.stringify({ name, transport })}`);
      }}
    >
      <DialFormItem id="name" label="Name">
        <DialInput
          id="name"
          placeholder="Entity name"
          value={name}
          onChange={(name) => setName(name ?? '')}
        />
      </DialFormItem>

      <DialFormItem
        {...args}
        id="transport-v"
        label="Transport"
        description="Required field."
        error={!transport ? 'Please choose a transport' : undefined}
      >
        <DialSelect
          value={transport}
          options={transportOptions}
          onChange={handleTransportChange}
          placeholder="Select…"
        />
      </DialFormItem>

      <DialPrimaryButton type="submit" label="Create" disabled={!isValid} />
    </form>
  );
};

export const Basic: Story = {
  args: { children: <div /> },
  render: (args) => <BasicFormExample {...args} />,
};

export const WithValidation: Story = {
  args: { children: <div /> },
  render: (args) => <WithValidationExample {...args} />,
};

export const SelectBasic: Story = {
  args: { children: <div /> },
  render: (args) => <SelectBasicExample {...args} />,
};

export const SelectHorizontal: Story = {
  args: { children: <div /> },
  render: (args) => <SelectHorizontalExample {...args} />,
};

export const SelectWithValidation: Story = {
  args: { children: <div /> },
  render: (args) => <SelectWithValidationExample {...args} />,
};
