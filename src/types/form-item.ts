import type { ReactNode } from 'react';

/**
 * Orientation options for form item layout
 *
 * @param Vertical - Vertical layout with label above the input
 * @param Horizontal - Horizontal layout with label beside the input
 */
export enum FormItemOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

/**
 * Base properties for form item components providing layout, labeling, and validation display
 *
 * @param [label] - The label text or element to display for the form item
 * @param required - Whether the field is required (displays required indicator)
 * @param description - Description text to display below the label
 * @param error - Error message, element, or boolean indicating validation state
 * @param captionDescription - Additional caption or description text
 * @param readonly - Whether the form item is in read-only mode
 * @param orientation - Layout orientation for the form item
 */
export interface DialFormItemBaseProps {
  label?: ReactNode;
  required?: boolean;
  description?: string;
  error?: ReactNode;
  captionDescription?: string;
  readonly?: boolean;
  orientation?: FormItemOrientation;
}
