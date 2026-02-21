import type { ArgTypes } from '@storybook/react';
import type { DialInputProps } from '@/components/Input/Input';

export const inputBaseArgTypes: Partial<ArgTypes<DialInputProps>> = {
  type: {
    control: { type: 'select' },
    options: ['text', 'password', 'email', 'number', 'search'],
    description: 'Input type',
  },
  placeholder: {
    control: { type: 'text' },
    description: 'Placeholder text',
  },
  containerClassName: {
    control: { type: 'text' },
    description: 'Additional CSS classes for the container',
  },
  className: {
    control: { type: 'text' },
    description: 'Additional CSS classes for the input element',
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether the input is disabled',
  },
  invalid: {
    control: { type: 'boolean' },
    description: 'Whether the input has an error state',
  },
  onChange: {
    control: false,
    description: 'Callback function called when the input value changes',
  },
  onBlur: {
    control: false,
    description: 'Callback function called when the input blurs',
  },
  iconAfter: {
    control: false,
    description: 'Icon or element to display after the input',
  },
  iconBefore: {
    control: false,
    description: 'Icon or element to display before the input',
  },
  prefix: {
    control: { type: 'text' as const },
    description: 'Text to display before the input',
  },
  postfix: {
    control: { type: 'text' as const },
    description: 'Text to display inside the input on the right',
  },
};

export const numberInputBaseArgTypes: Partial<ArgTypes<DialInputProps>> = {
  min: {
    control: { type: 'number' as const },
    description: 'Minimum allowed value for the number input',
  },
  max: {
    control: { type: 'number' as const },
    description: 'Maximum allowed value for the number input',
  },
};
