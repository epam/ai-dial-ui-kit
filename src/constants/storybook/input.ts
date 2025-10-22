import type {
  FieldControlProps,
  InputBaseProps,
  NumberInputBaseProps,
} from '@/models/field-control-props';
import type { ArgTypes } from '@storybook/react';

export const fieldControlArgTypes: Partial<ArgTypes<FieldControlProps>> = {
  fieldTitle: {
    control: { type: 'text' as const },
    description: 'The label text to display above the input field',
  },
  optional: {
    control: { type: 'boolean' as const },
    description:
      'Whether the field is optional (displays "(Optional)" indicator when true)',
  },
};

export const inputBaseArgTypes: Partial<ArgTypes<InputBaseProps>> = {
  elementId: {
    control: { type: 'text' as const },
    description: 'Unique identifier for the input element',
  },
  value: {
    control: { type: 'text' as const },
    description: 'The current value of the input (string, number, or null)',
  },
  defaultValue: {
    control: { type: 'text' as const },
    description: 'The default value for the input',
  },
  placeholder: {
    control: { type: 'text' as const },
    description: 'Placeholder text shown when input is empty',
  },
  disabled: {
    control: { type: 'boolean' as const },
    description: 'Whether the input is disabled and cannot be interacted with',
  },
  readonly: {
    control: { type: 'boolean' as const },
    description:
      'Whether the input is read-only (displays value as text, no input element)',
  },
  invalid: {
    control: { type: 'boolean' as const },
    description:
      'Whether the input has validation errors (applies error styling)',
  },
  iconAfter: {
    control: false,
    description: 'Icon or element to display after the input',
  },
  iconBefore: {
    control: false,
    description: 'Icon or element to display before the input',
  },
  textBeforeInput: {
    control: { type: 'text' as const },
    description: 'Text to display before the input',
  },
  textAfterInput: {
    control: { type: 'text' as const },
    description: 'Text to display after the input',
  },
  prefix: {
    control: { type: 'text' as const },
    description: 'Text to display inside the input on the left',
  },
  suffix: {
    control: { type: 'text' as const },
    description: 'Text to display inside the input on the right',
  },
};

export const numberInputBaseArgTypes: Partial<ArgTypes<NumberInputBaseProps>> =
  {
    min: {
      control: { type: 'number' as const },
      description: 'Minimum allowed value for the number input',
    },
    max: {
      control: { type: 'number' as const },
      description: 'Maximum allowed value for the number input',
    },
    isOnlyInteger: {
      control: { type: 'boolean' as const },
      description:
        'Whether to restrict input to integers only (no decimal values)',
    },
  };
