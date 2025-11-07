import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {
  DialFileManagerItemNameInput,
  type DialFileManagerItemNameInputProps,
} from './FileManagerItemNameInput';
import { DialItemType } from '@/types/item';

describe('Dial UI Kit :: DialFileManagerItemNameInput', () => {
  const defaultProps = {
    type: DialItemType.File,
    name: 'My Item',
    elementId: 'test-element',
  } as DialFileManagerItemNameInputProps;

  test('renders icon and input with correct props', () => {
    render(<DialFileManagerItemNameInput {...defaultProps} />);

    const icon = screen.getByLabelText('File type icon');
    const input = screen.getByDisplayValue('My Item');

    expect(icon).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(
      <DialFileManagerItemNameInput {...defaultProps} onChange={onChange} />,
    );

    const input = screen.getByDisplayValue('My Item');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(onChange).toHaveBeenCalledWith('New Value');
  });

  test('renders error icon when inputInvalid is true', () => {
    render(<DialFileManagerItemNameInput {...defaultProps} inputInvalid />);

    const icon = screen.getByLabelText('alert');
    expect(icon).toBeInTheDocument();
  });

  test('does not render tooltip when inputInvalid is false', () => {
    render(
      <DialFileManagerItemNameInput {...defaultProps} inputInvalid={false} />,
    );
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });

  test('renders custom inputIconAfter when provided', () => {
    render(
      <DialFileManagerItemNameInput
        {...defaultProps}
        inputInvalid
        inputIconAfter={<span aria-label="custom-icon">X</span>}
      />,
    );

    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });
});
