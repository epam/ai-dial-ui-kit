import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {
  DialItemNameInput,
  type DialItemNameInputProps,
} from './ItemNameInput';
import { DialItemType } from '@/types/item';

describe('Dial UI Kit :: DialItemNameInput', () => {
  const defaultProps = {
    type: DialItemType.File,
    name: 'My Item',
    elementId: 'test-element',
  } as DialItemNameInputProps;

  test('renders icon and input with correct props', () => {
    render(<DialItemNameInput {...defaultProps} />);

    const icon = screen.getByLabelText('File type icon');
    const input = screen.getByDisplayValue('My Item');

    expect(icon).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<DialItemNameInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByDisplayValue('My Item');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(onChange).toHaveBeenCalledWith('New Value');
  });

  test('renders error icon when inputInvalid is true', () => {
    render(<DialItemNameInput {...defaultProps} inputInvalid />);

    const icon = screen.getByLabelText('alert');
    expect(icon).toBeInTheDocument();
  });

  test('does not render tooltip when inputInvalid is false', () => {
    render(<DialItemNameInput {...defaultProps} inputInvalid={false} />);
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });

  test('renders custom inputIconAfter when provided', () => {
    render(
      <DialItemNameInput
        {...defaultProps}
        inputInvalid
        inputIconAfter={<span aria-label="custom-icon">X</span>}
      />,
    );

    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });
});
