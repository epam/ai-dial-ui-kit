import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { ElementSize } from '@/types/size';
import { NumberInput } from './NumberInput';

describe('Dial UI Kit :: NumberInput', () => {
  test('renders the field through the 2.0 Input', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        size={ElementSize.Small}
        invalid
      />,
    );

    const wrapper = screen.getByLabelText('input-container');
    expect(wrapper).toHaveClass('dial-kit-input', 'dial-kit-input-small');
    expect(wrapper).toHaveClass('dial-kit-input-error');
    expect(screen.getByRole('spinbutton')).toHaveAccessibleName(
      'Test Number Field',
    );
  });

  test('keeps the numeric key guard when a custom onKeyDown is passed', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    const onChange = vi.fn();
    render(
      <NumberInput
        id="test-number"
        placeholder="num"
        onKeyDown={onKeyDown}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.keyboard('a');

    // The consumer's handler still sees the key, but the guard blocked it.
    expect(onKeyDown).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders with basic props', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
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
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        value={42.5}
      />,
    );

    expect(screen.getByText(/test number field/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('42.5')).toBeInTheDocument();
  });

  test('shows required indicator when required is true', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field', required: true }}
      />,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('displays error text when provided', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        error="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('calls onChange with processed number value', () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  test('applies min and max attributes correctly', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
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
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        min={10}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '10');
    expect(input).not.toHaveAttribute('max');
  });

  test('does not apply min/max attributes when not provided', () => {
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
      />,
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
  });

  test('handles decimal values with min and max constraints', () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
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
      <NumberInput
        id="test-number"
        labelProps={{ label: 'Test Number Field' }}
        min={0}
        max={1}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0.005' } });

    expect(onChange).toHaveBeenCalledWith('0.005');
  });

  describe('integer mode', () => {
    test('blocks decimal point keystroke', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('.');

      expect(onChange).not.toHaveBeenCalled();
    });

    test('blocks minus sign keystroke', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('-');

      expect(onChange).not.toHaveBeenCalled();
    });

    test('blocks e, E, and + keys', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('e');
      await user.keyboard('E');
      await user.keyboard('+');

      expect(onChange).not.toHaveBeenCalled();
    });

    test('allows digit keys', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('5');

      expect(onChange).toHaveBeenCalledWith(5);
    });

    test('onChange emits number, not string', () => {
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });

      expect(onChange).toHaveBeenCalledWith(42);
      expect(typeof onChange.mock.calls[0][0]).toBe('number');
    });

    test('strips non-digit characters on paste', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.paste('12.34');

      expect(onChange).toHaveBeenCalledWith(1234);
    });

    test('does not intercept paste when text is all digits', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput
          id="int-test"
          placeholder="int"
          integer
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.paste('1234');

      expect(onChange).toHaveBeenCalledWith(1234);
    });

    test('without integer prop, decimal input still works', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <NumberInput id="test-number" placeholder="num" onChange={onChange} />,
      );

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.paste('1.5');

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(1.5);
    });
  });
});
