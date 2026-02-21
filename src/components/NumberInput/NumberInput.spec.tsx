import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialNumberInput } from './NumberInput';

describe('Dial UI Kit :: DialNumberInput', () => {
  test('renders with basic props', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        placeholder="Enter number"
        value={42.5}
      />,
    );

    expect(screen.getByText(/test number field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  test('renders with value', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        value={42.5}
      />,
    );

    expect(screen.getByText(/test number field/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  test('shows required indicator when required is true', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field', required: true }}
      />,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('displays error text when provided', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        errorText="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('calls onChange with processed number value', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  test('applies min and max attributes correctly', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        min={0}
        max={100}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  test('applies only min attribute when max is not provided', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        min={10}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '10');
    expect(input).not.toHaveAttribute('max');
  });

  test('does not apply min/max attributes when not provided', () => {
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
  });

  test('handles decimal values with min and max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        min={0.1}
        max={99.9}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0.1');
    expect(input).toHaveAttribute('max', '99.9');

    fireEvent.change(input, { target: { value: '50.5' } });
    expect(onChange).toHaveBeenCalledWith(50.5);
  });

  test('handles leading zeros properly with min/max constraints', () => {
    const onChange = vi.fn();
    render(
      <DialNumberInput
        id="test-number"
        labelProps={{ fieldLabel: 'Test Number Field' }}
        min={0}
        max={1}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0.005' } });

    expect(onChange).toHaveBeenCalledWith('0.005');
  });
});
