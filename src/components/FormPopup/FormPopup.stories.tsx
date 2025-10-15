import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFormPopup, type DialFormPopupProps } from './FormPopup';
import { DialInput } from '@/components/Input/Input';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';

const meta = {
  title: 'Overlay/FormPopup',
  component: DialFormPopup,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: false },
    title: { control: { type: 'text' } },
    cssClass: { control: { type: 'text' } },
    submitClassName: { control: { type: 'text' } },
    dividers: { control: { type: 'boolean' } },
    submitLabel: { control: { type: 'text' } },
    cancelLabel: { control: { type: 'text' } },
    isLoading: { control: { type: 'boolean' } },
    disableSubmitButton: { control: { type: 'boolean' } },
    onClose: { action: 'onClose', control: false },
    onSubmit: { action: 'onSubmit', control: false },
    onCancel: { action: 'onCancel', control: false },
  },
  args: {
    title: 'Create Entity',
    submitLabel: 'Create',
    cancelLabel: 'Cancel',
  },
} satisfies Meta<DialFormPopupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const FormExample = (
  args: DialFormPopupProps & { children?: React.ReactNode },
) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="px-3 py-2 rounded bg-accent-primary text-white hover:opacity-90"
        onClick={() => setOpen(true)}
      >
        Open Form
      </button>

      <DialFormPopup
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose?.();
        }}
        onCancel={() => {
          setOpen(false);
          args.onCancel?.();
        }}
        onSubmit={() => {
          setOpen(false);
          args.onSubmit?.();
        }}
      >
        {args.children}
      </DialFormPopup>
    </>
  );
};

export const SimpleForm: Story = {
  args: {
    onSubmit: () => null,
  },
  render: (args) => {
    const SimpleFormInner = () => {
      const [name, setName] = useState('');
      const [agree, setAgree] = useState(false);

      return (
        <FormExample {...args} disableSubmitButton={!name || !agree}>
          <form className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block dial-small text-secondary mb-1"
              >
                Name
              </label>
              <DialInput
                elementId="name"
                placeholder="Type a name…"
                value={name}
                onChange={setName}
              />
            </div>

            <DialCheckbox
              id="agree"
              label="I confirm the information is correct"
              checked={agree}
              onChange={(v) => setAgree(Boolean(v))}
            />
          </form>
        </FormExample>
      );
    };

    return <SimpleFormInner />;
  },
};
export const WithValidationAndDividers: Story = {
  args: {
    onSubmit: () => null,
    onCancel: () => null,
    onClose: () => null,
  },
  render: (args) => {
    const WithValidationInner = () => {
      const [email, setEmail] = useState('');
      const [subscribe, setSubscribe] = useState(true);

      const isEmailValid = useMemo(
        () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        [email],
      );

      return (
        <FormExample {...args} dividers disableSubmitButton={!isEmailValid}>
          <form className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block dial-small text-secondary mb-1"
              >
                Email
              </label>
              <DialInput
                elementId="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={setEmail}
                invalid={email.length > 0 && !isEmailValid}
              />
              {!isEmailValid && email && (
                <p className="dial-small text-error mt-1">
                  Enter a valid email.
                </p>
              )}
            </div>

            <DialCheckbox
              id="subscribe"
              label="Send a welcome email"
              checked={subscribe}
              onChange={(v) => setSubscribe(Boolean(v))}
            />
          </form>
        </FormExample>
      );
    };

    return <WithValidationInner />;
  },
};
