import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { DialFormItem, type DialFormItemProps } from './FormItem';

import { DialInput } from '@/components/Input/Input';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';
import { DialSelect } from '@/components/Select/Select';
import { FormItemOrientation } from '@/types/form-item';

interface Option {
  label: string;
  value: string;
}

const meta = {
  title: 'Form/FormItem',
  component: DialFormItem,
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: [FormItemOrientation.Vertical, FormItemOrientation.Horizontal],
    },
    label: { control: 'text' },
    optional: { control: 'boolean' },
    optionalText: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    labelVisuallyHidden: { control: 'boolean' },
    cssClass: { control: 'text' },
    childrenCssClass: { control: 'text' },
    labelCssClass: { control: 'text' },
    errorCssClass: { control: 'text' },
    captionDescription: { control: 'text' },
  },
  args: {
    elementId: 'field',
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
        elementId="name"
        label="Name"
        description="Type your full name."
        captionDescription="This is additional caption text."
      >
        <DialInput
          elementId="name"
          placeholder="John Doe"
          value={name}
          onChange={setName}
        />
      </DialFormItem>

      <DialFormItem
        elementId="agree"
        label="Terms"
        optional
        optionalText="(optional)"
        description="You must accept the terms to proceed."
      >
        <DialCheckbox
          id="agree"
          label="I accept the terms"
          checked={agree}
          onChange={(v) => setAgree(Boolean(v))}
        />
      </DialFormItem>

      <button
        type="submit"
        className="px-3 py-2 rounded bg-accent-primary text-white"
      >
        Submit
      </button>
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
        elementId="email"
        label="Email"
        description="We will send an invitation link."
        captionDescription="Make sure to enter a valid email address."
        error={!isValid && email ? 'Enter a valid email' : undefined}
      >
        <DialInput
          elementId="email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={setEmail}
          invalid={email.length > 0 && !isValid}
        />
      </DialFormItem>

      <button
        type="submit"
        className="px-3 py-2 rounded bg-accent-primary text-white disabled:opacity-60"
        disabled={!isValid}
      >
        Send Invite
      </button>
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
        elementId="transport"
        label="Transport"
        description="Select your preferred transport type."
        cssClass="w-[160px]"
      >
        <DialSelect
          value={transport}
          options={transportOptions}
          onChange={handleTransportChange}
          placeholder="Pick transport"
        />
      </DialFormItem>

      <button
        type="submit"
        className="px-3 py-2 rounded bg-accent-primary text-white"
      >
        Save
      </button>
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
        elementId="transport-h"
        label="Transport"
        orientation={FormItemOrientation.Horizontal}
        labelCssClass="w-32 mt-1"
        description="Horizontal layout with label on the left."
      >
        <DialSelect
          value={transport}
          options={transportOptions}
          onChange={handleTransportChange}
        />
      </DialFormItem>

      <button
        type="submit"
        className="px-3 py-2 rounded bg-accent-primary text-white"
      >
        Save
      </button>
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
      <DialFormItem elementId="name" label="Name">
        <DialInput
          elementId="name"
          placeholder="Entity name"
          value={name}
          onChange={setName}
        />
      </DialFormItem>

      <DialFormItem
        {...args}
        elementId="transport-v"
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

      <button
        type="submit"
        className="px-3 py-2 rounded bg-accent-primary text-white disabled:opacity-60"
        disabled={!isValid}
      >
        Create
      </button>
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
