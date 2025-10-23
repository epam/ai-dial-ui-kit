import {
  FormItemOrientation,
  type DialFormItemBaseProps,
} from '@/types/form-item';
import type { ArgTypes } from '@storybook/react';

export const dialFormItemBaseArgTypes: Partial<
  ArgTypes<DialFormItemBaseProps>
> = {
  label: {
    control: { type: 'text' as const },
    description: 'The label text or element to display for the form item',
  },
  optional: {
    control: { type: 'boolean' as const },
    description: 'Whether the field is optional (displays optional indicator)',
  },
  optionalText: {
    control: { type: 'text' as const },
    description:
      'Custom text to display for optional fields (default: "(Optional)")',
  },
  description: {
    control: { type: 'text' as const },
    description: 'Description text to display below the label',
  },
  error: {
    control: { type: 'text' as const },
    description:
      'Error message, element, or boolean indicating validation state',
  },
  captionDescription: {
    control: { type: 'text' as const },
    description: 'Additional caption or description text',
  },
  readonly: {
    control: { type: 'boolean' as const },
    description: 'Whether the form item is in read-only mode',
  },
  orientation: {
    control: { type: 'radio' as const },
    options: [FormItemOrientation.Vertical, FormItemOrientation.Horizontal],
    description: 'Layout orientation for the form item',
  },
};
