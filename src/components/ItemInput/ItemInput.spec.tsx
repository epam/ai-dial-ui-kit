import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { DialItemInput, type DialItemInputProps } from './ItemInput';
import type { DialItemIconProps } from '@/components/ItemIcon/ItemIcon';
import type { DialInputProps } from '@/components/Input/Input';
import type { DialTooltipProps } from '@/components/Tooltip/Tooltip';

vi.mock('@/components/ItemIcon/ItemIcon', () => ({
  DialItemIcon: ({ name, type, loading, shared }: DialItemIconProps) => (
    <div
      data-testid="dial-item-icon"
      data-name={name}
      data-type={type}
      data-loading={loading}
      data-shared={shared}
    >
      MockIcon
    </div>
  ),
}));

vi.mock('@/components/Input/Input', () => ({
  DialInput: ({
    elementId,
    defaultValue,
    onChange,
    invalid,
    iconAfter,
  }: DialInputProps) => (
    <div>
      <input
        data-testid="dial-input"
        id={elementId}
        defaultValue={defaultValue}
        aria-invalid={invalid}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {iconAfter}
    </div>
  ),
}));

vi.mock('@/components/Tooltip/Tooltip', () => ({
  DialTooltip: ({ tooltip, children }: DialTooltipProps) => (
    <div data-testid="tooltip" data-tooltip={tooltip}>
      {children}
    </div>
  ),
}));

describe('DialItemInput', () => {
  const defaultProps = {
    type: 'folder',
    name: 'My Item',
    elementId: 'test-id',
  } as DialItemInputProps;

  test('renders icon and input with correct props', () => {
    render(<DialItemInput {...defaultProps} />);

    const icon = screen.getByTestId('dial-item-icon');
    const input = screen.getByTestId('dial-input');

    expect(icon).toHaveAttribute('data-name', 'My Item');
    expect(icon).toHaveAttribute('data-type', 'folder');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveValue('My Item');
  });

  test('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<DialItemInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId('dial-input');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(onChange).toHaveBeenCalledWith('New Value');
  });

  test('renders error icon and tooltip when inputInvalid is true', () => {
    render(
      <DialItemInput
        {...defaultProps}
        inputInvalid
        inputInvalidMessage="Invalid name"
      />,
    );

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-tooltip', 'Invalid name');
  });

  test('does not render tooltip when inputInvalid is false', () => {
    render(<DialItemInput {...defaultProps} inputInvalid={false} />);
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });

  test('renders custom inputIconAfter when provided', () => {
    render(
      <DialItemInput
        {...defaultProps}
        inputInvalid
        inputIconAfter={<span data-testid="custom-icon">X</span>}
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
